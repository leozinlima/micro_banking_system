from app.controllers.application import Application
from bottle import Bottle, run, request, static_file
from bottle import redirect

# Inicializa a aplicação Bottle
app = Bottle()
ctl = Application()  # Cria uma instância da classe Application para controle da lógica de negócios

# Rota para servir arquivos estáticos
@app.route('/static/<filepath:path>')
def serve_static(filepath):
    # Serve arquivos estáticos da pasta `./app/static`
    return static_file(filepath, root='./app/static')

# Rota para a página inicial
@app.route('/')
@app.route('/user/<unknown>')
def index(unknown=None):
    # Renderiza a página inicial ou redireciona para a página inicial personalizada de um usuário autenticado
    if not unknown:
        return ctl.render('index')
    else:
        if ctl.is_authenticated(unknown):
            return ctl.render('home', unknown)
        else:
            redirect('/index')

# Rota para a página de registro (GET)
@app.route('/register', method='GET')
def register():
    # Exibe a página de registro de usuário
    return ctl.render('register')

# Rota para registrar um novo usuário (POST)
@app.route('/register', method='POST')
def action_register():
    # Processa os dados do formulário de registro e cria um novo usuário
    first_name = request.forms.get('firstName')
    last_name = request.forms.get('lastName')
    email = request.forms.get('registerEmail')
    password = request.forms.get('registerPassword')
    dob = request.forms.get('registerDob')

    # Verifica se o email já existe
    if ctl.email_exists(email):
        redirect('/register?error=email_exists')
    else:
        ctl.create_user(first_name, last_name, email, password, dob)
        redirect('/')

# Rota para verificar se um email já está registrado (GET)
@app.route('/email_exists', method='GET')
def email_exists():
    # Verifica se um endereço de email já está registrado
    email = request.query.get('email')
    exists = ctl.email_exists(email)
    return {'exists': exists}

# Rota para a página inicial do usuário autenticado
@app.route('/home', method='GET')
def action_home():
    # Renderiza a página inicial do usuário autenticado
    return ctl.render('home')

# Rota para a página de login (GET)
@app.route('/index', method='GET')
def login():
    # Exibe a página de login
    return ctl.render('index')

# Rota para processar login (POST)
@app.route('/index', method='POST')
def action_index():
    # Processa os dados do formulário de login e autentica o usuário
    username = request.forms.get('username')
    password = request.forms.get('password')
    ctl.authenticate_user(username, password)

# Rota para logout (POST)
@app.route('/logout', method='POST')
def logout():
    # Encerra a sessão do usuário
    ctl.logout_user()

# Rota para a página de configurações (GET)
@app.route('/settings', method='GET')
def settings():
    # Exibe a página de configurações
    return ctl.render('settings')

# Rota para a página de depósito (GET)
@app.route('/deposito', method='GET')
def deposito():
    # Exibe a página de depósito
    return ctl.render('deposit')

# Rota para a página de saque (GET)
@app.route('/saque', method='GET')
def saque():
    # Exibe a página de saque
    return ctl.render('withdraw')

# Rota para a página de transferência (GET)
@app.route('/transferencia', method='GET')
def transferencia():
    # Exibe a página de transferência
    return ctl.render('transfer')

# Rota para processar transferência (POST)
@app.route('/transferencia', method='POST')
def action_transfer():
    # Processa a transferência de valores
    return ctl.process_transfer()

# Rota para processar saque (POST)
@app.route('/saque', method='POST')
def process_withdraw():
    # Processa o saque de valores
    return ctl.process_withdraw()

# Rota para processar depósito (POST)
@app.route('/deposito', method='POST')
def process_deposit():
    # Processa o depósito de valores
    return ctl.process_deposit()

# Rota para atualizar perfil do usuário (POST)
@app.route('/update_profile', method='POST')
def update_profile():
    # Processa a atualização do perfil do usuário
    return ctl.update_profile()

# Rota para processar a atualização de senha (POST)
@app.route('/update_password', method='POST')
def update_password():
    # Processa a atualização da senha do usuário
    return ctl.update_password()

# Rota para deletar conta do usuário (POST)
@app.route('/delete_account', method='POST')
def delete_account():
    # Processa a exclusão da conta do usuário
    return ctl.delete_account()

# Inicialização do servidor
if __name__ == '__main__':
    # Executa o servidor da aplicação Bottle na porta 8080 em modo de debug
    run(app, host='localhost', port=8080, debug=True)
