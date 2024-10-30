import random
import string

class Person:
    # Classe base que representa uma pessoa

    def __init__(self, first_name, last_name, dob):
        # Inicializa uma nova instância de uma pessoa com nome, sobrenome e data de nascimento opcional
        self.first_name = first_name
        self.last_name = last_name
        self.dob = dob  # Atribuindo o atributo dob à instância


class UserAccount(Person):
    # Classe que representa uma conta de usuário, herda de Person

    def __init__(self, first_name, last_name, username, password, dob, balance=0, bank_account_id=None):
        # Inicializa uma nova instância de conta de usuário com nome, sobrenome, nome de usuário, senha, saldo, ID de conta bancária, e data de nascimento opcional
        super().__init__(first_name, last_name, dob)  # Chama o construtor da classe base Person
        self.username = username
        self.password = password
        self.balance = balance
        # Gera um ID de conta bancária se não for fornecido
        self.bank_account_id = bank_account_id if bank_account_id else self.generate_bank_account_id()

    def generate_bank_account_id(self):
        # Gera um ID único de conta bancária no formato "NNNLLL"
        letters = ''.join(random.choices(string.ascii_uppercase, k=3))  # Gera três letras aleatórias maiúsculas
        numbers = ''.join(random.choices(string.digits, k=3))  # Gera três números aleatórios
        return numbers + letters  # Combina números e letras no formato desejado
