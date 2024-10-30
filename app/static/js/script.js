// Verificação para o formulário de login
if (document.getElementById('loginForm')) {
    // Adiciona um event listener ao formulário de login para capturar o evento de submissão
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede a submissão imediata para permitir validações
        const loginEmail = document.getElementById('loginEmail').value; // Obtém o valor do campo de email
        const loginPassword = document.getElementById('loginPassword').value; // Obtém o valor do campo de senha

        const form = document.getElementById('loginForm'); // Referência ao formulário
        form.submit(); // Submete o formulário ao backend para autenticação
    });

    // Adiciona um event listener ao botão de registro
    document.getElementById('registerBtn').addEventListener('click', function() {
        window.location.href = "/register"; // Redireciona para a página de registro
    });

    // Verificação de erro de login através do cookie
    document.addEventListener('DOMContentLoaded', function() {
        // Função para obter o valor de um cookie específico
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift(); // Retorna o valor do cookie se encontrado
        }

        const loginError = getCookie('login_error'); // Verifica se há um cookie de erro de login

        if (loginError) {
            alert('Falha no login. Verifique suas credenciais e tente novamente.');

            // Remove o cookie após mostrar o alerta
            document.cookie = "login_error=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    });
}

// Verificação para o formulário de registro
if (document.getElementById('registerForm')) {
    // Adiciona um event listener ao formulário de registro para capturar o evento de submissão
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        const registerEmail = document.getElementById('registerEmail').value; // Obtém o valor do campo de email
        const registerPassword = document.getElementById('registerPassword').value; // Obtém o valor do campo de senha
        const registerConfirmPassword = document.getElementById('registerConfirmPassword').value; // Obtém o valor do campo de confirmação de senha
        const registerDob = new Date(document.getElementById('registerDob').value); // Obtém a data de nascimento
        const today = new Date();
        
        let age = today.getFullYear() - registerDob.getFullYear();
        const monthDiff = today.getMonth() - registerDob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < registerDob.getDate())) {
            age--;
        }
    
        if (age < 18) {
            alert('Você deve ter pelo menos 18 anos para se registrar.');
            event.preventDefault();
            return;
        }

        // Verifica se as senhas são iguais
        if (registerPassword !== registerConfirmPassword) {
            alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
            event.preventDefault(); // Impede a submissão do formulário
            return;
        }

        // Verificação do email já existente é feita no servidor e o resultado é exibido no frontend
        event.preventDefault();
        fetch(`/email_exists?email=${encodeURIComponent(registerEmail)}`)
            .then(response => response.json()) // Converte a resposta em JSON
            .then(data => {
                if (data.exists) {
                    alert('O email informado já está registrado. Por favor, use outro email.');
                } else {
                    alert('Cadastro realizado com sucesso!');
                    document.getElementById('registerForm').submit(); // Submete o formulário após validação
                }
            })
            .catch(error => console.error('Erro:', error)); // Captura e exibe erros no console
    });
}

// Função de Logout
if (document.getElementById('logoutBtn')) {
    // Adiciona um event listener ao botão de logout para capturar o evento de clique
    document.getElementById('logoutBtn').addEventListener('click', function(event) {
        event.preventDefault(); // Impede o comportamento padrão do link
        fetch('/logout', { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    alert("Você saiu com sucesso!"); // Mensagem de sucesso
                    window.location.href = "/"; // Redireciona para a página inicial
                } else {
                    alert("Erro ao tentar fazer logout. Tente novamente.");
                }
            })
            .catch(error => console.error('Erro:', error)); // Captura e exibe erros no console
    });
}

// Verifica se o botão de Home está presente na página
if (document.querySelector('.home-icon a')) {
    // Adiciona um event listener ao botão de Home para capturar o evento de clique
    document.querySelector('.home-icon a').addEventListener('click', function(event) {
        event.preventDefault(); // Impede o comportamento padrão do link
        window.location.href = "/home"; // Redireciona para /home
    });
}

// Verifica se o ícone de retorno está presente na página
if (document.querySelector('.return-icon a')) {
    // Adiciona um event listener ao ícone de retorno para capturar o evento de clique
    document.querySelector('.return-icon a').addEventListener('click', function(event) {
        event.preventDefault(); // Impede o comportamento padrão do link
        window.location.href = "/"; // Redireciona para /index
    });
}

// Adiciona event listeners aos botões de depósito, saque, transferência e limpar
document.addEventListener('DOMContentLoaded', function() {
    const depositForm = document.getElementById('depositForm'); // Botão de depósito
    const withdrawForm = document.getElementById('withdrawForm'); // Botão de saque
    const transferForm = document.getElementById('transferForm'); // Botão de transferência
    const clearBtn = document.getElementById('clearBtn'); // Botão de limpar

    if (depositForm) {
        // Função para processamento de depósitos
        depositForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede a submissão imediata para permitir validações
            const depositValue = parseFloat(document.getElementById('depositValue').value); // Obtém o valor de depósito

            if (depositValue > 0) {
                fetch('/deposito', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount: depositValue }) // Envia os dados de depósito ao backend
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao processar a solicitação');
                    }
                    return response.json(); // Converte a resposta em JSON
                })
                .then(data => {
                    if (data.success) {
                        alert('Depósito realizado com sucesso!');
                    } else {
                        alert('Erro ao realizar depósito: ' + data.message);
                    }
                    window.location.href = "/home"; // Redireciona para a página inicial após sucesso
                })
                .catch(error => {
                    console.error('Erro:', error); // Captura e exibe erros no console
                    alert('Erro ao realizar depósito. Tente novamente mais tarde.');
                    window.location.href = "/deposito"; // Redireciona para a página de depósito em caso de erro
                });                              
            } else {
                alert('Por favor, insira um valor válido para o depósito.');
            }
        });
    }

    if (withdrawForm) {
        // Função para processamento de saques
        withdrawForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede a submissão imediata para permitir validações
            const withdrawValue = parseFloat(document.getElementById('withdrawValue').value); // Obtém o valor de saque

            if (withdrawValue > 0) {
                fetch('/saque', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount: withdrawValue }) // Envia os dados de saque ao backend
                })
                .then(response => response.json()) // Converte a resposta em JSON
                .then(data => {
                    if (data.success) {
                        alert('Saque realizado com sucesso!');
                    } else {
                        alert('Erro ao realizar saque: ' + data.message);
                    }
                    window.location.href = "/home"; // Redireciona para a página inicial após sucesso
                })
                .catch(error => {
                    console.error('Erro:', error); // Captura e exibe erros no console
                    alert('Erro ao realizar saque. Tente novamente mais tarde.');
                    window.location.href = "/saque"; // Redireciona para a página de saque em caso de erro
                });
            } else {
                alert('Por favor, insira um valor válido para o saque.');
            }
        });
    }

    if (transferForm) {
        // Função para processamento de transferências
        transferForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede a submissão imediata para permitir validações
            const destinationAccount = document.getElementById('destinationAccount').value; // Obtém a conta de destino
            const transferValue = parseFloat(document.getElementById('transferValue').value); // Obtém o valor de transferência

            if (transferValue > 0 && destinationAccount) {
                fetch('/transferencia', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ destinationAccount, amount: transferValue }) // Envia os dados de transferência ao backend
                })
                .then(response => response.json()) // Converte a resposta em JSON
                .then(data => {
                    if (data.success) {
                        alert('Transferência realizada com sucesso!');
                        window.location.href = "/home"; // Redireciona para a página inicial após sucesso
                    } else {
                        alert('Erro ao realizar transferência: ' + data.message);
                        window.location.href = "/transferencia"; // Redireciona para a página de transferência se ocorrer um erro
                    }
                })
                .catch(error => {
                    console.error('Erro:', error); // Captura e exibe erros no console
                    alert('Erro ao realizar transferência. Tente novamente mais tarde.');
                    window.location.href = "/transferencia"; // Redireciona para a página de transferência em caso de erro
                });
            } else {
                alert('Por favor, insira um valor válido e uma conta de destino.');
            }
        });
    }

    if (clearBtn) {
        // Função para limpar campos nos formulários
        clearBtn.addEventListener('click', function() {
            if (document.body.classList.contains('transferencia')) {
                document.getElementById('destinationAccount').value = ''; // Limpa o campo da conta de destino
                document.getElementById('transferValue').value = ''; // Limpa o valor de transferência
            } else if (document.body.classList.contains('saque')) {
                document.getElementById('withdrawValue').value = ''; // Limpa o valor de saque
            } else if (document.body.classList.contains('deposito')) {
                document.getElementById('depositValue').value = ''; // Limpa o valor de depósito
            }
        });
    }
});

// Redireciona para a página de configurações ao clicar no botão de configurações
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#configBtn').forEach(function(configBtn) {
        configBtn.addEventListener('click', function() {
            window.location.href = "/settings";
        });
    });
});

// Verificação para o formulário de perfil
if (document.getElementById('profileForm')) {
    document.getElementById('profileForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede a submissão padrão do formulário

        // Verifica se o formulário é válido
        if (!this.checkValidity()) {
            this.reportValidity(); // Exibe as mensagens de erro padrão do navegador
            return;
        }

        const updatedProfile = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            dob: document.getElementById('dob').value
        };

        fetch('/update_profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProfile) // Envia os dados atualizados ao backend
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert(data.message); // Exibe a mensagem de erro do backend, como "Este e-mail já está em uso por outro usuário"
                return;
            }
            alert('Perfil atualizado com sucesso!');
            window.location.href = "/home"; // Redireciona para a página de configurações
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao atualizar o perfil. Tente novamente mais tarde.');
        });
    });
}

// Verificação para o formulário de senha
if (document.getElementById('passwordForm')) {
    document.getElementById('passwordForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede a submissão padrão do formulário

        const passwordData = {
            currentPassword: document.getElementById('currentPassword').value,
            newPassword: document.getElementById('newPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value,
        };

        fetch('/update_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(passwordData) // Envia os dados ao backend
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert(data.message); // Exibe a mensagem de erro do backend
                return;
            }
            alert('Senha atualizada com sucesso!');
            window.location.href = "/home"; // Redireciona para a página de configurações
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao atualizar a senha. Tente novamente mais tarde.');
        });
    });
}

// Adiciona event listener ao botão de deletar conta
document.addEventListener('DOMContentLoaded', function() {
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            // Exibe uma caixa de confirmação
            const userConfirmed = confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.');

            if (userConfirmed) {
                // Se o usuário confirmou, envia uma requisição para deletar a conta
                fetch('/delete_account', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => {
                    if (response.ok) {
                        alert('Conta deletada com sucesso!');
                        window.location.href = "/"; // Redireciona para a página inicial após deletar a conta
                    } else {
                        alert('Erro ao deletar a conta. Tente novamente.');
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    alert('Erro ao deletar a conta. Tente novamente.');
                });
            }
        });
    }
});

// Funcionalidade de depósito - Redireciona para a página de depósito
document.getElementById('depositPageBtn').addEventListener('click', function() {
    window.location.href = "/deposito";
});

// Funcionalidade de saque - Redireciona para a página de saque
document.getElementById('withdrawPageBtn').addEventListener('click', function() {
    window.location.href = "/saque";
});

// Funcionalidade de transferência - Redireciona para a página de transferência
document.getElementById('transferPageBtn').addEventListener('click', function() {
    window.location.href = "/transferencia";
});
