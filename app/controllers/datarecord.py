from app.models.user_account import UserAccount
import json
import uuid

class DataRecord():
    # Banco de dados JSON para o recurso Usuários

    def __init__(self):
        # Inicializa as listas de contas de usuários e usuários autenticados
        self.__user_accounts = []
        self.__authenticated_user = None
        self.read()  # Carrega os dados do arquivo JSON

    def read(self):
        # Lê os dados dos usuários a partir do arquivo JSON
        try:
            with open("app/controllers/db/user_accounts.json", "r") as arquivo_json:
                user_data = json.load(arquivo_json)  # Carrega os dados do JSON
                self.__user_accounts = [UserAccount(**data) for data in user_data]  # Converte os dados em objetos UserAccount
        except FileNotFoundError:
            # Se o arquivo não for encontrado, cria um usuário Guest
            self.__user_accounts.append(UserAccount('Guest', '000000'))

    def book(self, first_name, last_name, username, password, dob):
        # Cria um novo usuário e o adiciona à lista de contas de usuário
        new_user = UserAccount(first_name, last_name, username, password, dob)
        self.__user_accounts.append(new_user)
        with open("app/controllers/db/user_accounts.json", "w") as arquivo_json:
            user_data = [vars(user_account) for user_account in self.__user_accounts]  # Converte os objetos em dicionários
            json.dump(user_data, arquivo_json)  # Salva os dados atualizados no arquivo JSON

    def getCurrentUser(self, session_id):
        # Verifica se há um usuário autenticado
        if self.__authenticated_user and session_id:
            return self.__authenticated_user
        return None

    def update_user(self, user):
        # Atualiza os dados de um usuário existente
        for i, existing_user in enumerate(self.__user_accounts):
            if existing_user.username == user.username:
                self.__user_accounts[i] = user  # Substitui o usuário existente pelo atualizado
                break
        with open("app/controllers/db/user_accounts.json", "w") as arquivo_json:
            user_data = [vars(user_account) for user_account in self.__user_accounts]  # Converte os objetos em dicionários
            json.dump(user_data, arquivo_json)  # Salva os dados atualizados no arquivo JSON

    def checkUser(self, username, password):
        # Verifica as credenciais do usuário para autenticação
        for user in self.__user_accounts:
            if user.username == username and user.password == password:
                session_id = str(uuid.uuid4())  # Gera um ID de sessão como string
                self.__authenticated_user = user  # Associa o usuário autenticado
                return session_id  # Retorna o ID de sessão como string
        return None  # Retorna None se a autenticação falhar

    def logout(self):
        # Desloga o usuário atual
        self.__authenticated_user = None  # Remove a associação com o usuário autenticado

    def email_exists(self, email):
        # Verifica se o email (nome de usuário) já está registrado
        return any(user.username == email for user in self.__user_accounts)
    
    def delete_user(self, username):
        # Remove um usuário com base no nome de usuário
        self.__user_accounts = [user for user in self.__user_accounts if user.username != username]
        with open("app/controllers/db/user_accounts.json", "w") as arquivo_json:
            user_data = [vars(user_account) for user_account in self.__user_accounts]
            json.dump(user_data, arquivo_json)  # Salva os dados atualizados no arquivo JSON
