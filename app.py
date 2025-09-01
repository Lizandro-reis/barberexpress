from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import json
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.secret_key = 'barber_express_secret_key_2025'
CORS(app)

# Dados simulados (em produção seria um banco de dados)
usuarios = {}
agendamentos = []

servicos = [
    {
        'id': 1,
        'nome': 'Corte Tradicional',
        'descricao': 'Corte clássico masculino com acabamento profissional',
        'preco': 35.00,
        'duracao': 45
    },
    {
        'id': 2,
        'nome': 'Corte + Barba',
        'descricao': 'Corte completo com aparação e desenho da barba',
        'preco': 55.00,
        'duracao': 60
    },
    {
        'id': 3,
        'nome': 'Barba Completa',
        'descricao': 'Aparação, desenho e hidratação da barba',
        'preco': 25.00,
        'duracao': 30
    },
    {
        'id': 4,
        'nome': 'Corte Moderno',
        'descricao': 'Cortes modernos e estilizados',
        'preco': 45.00,
        'duracao': 50
    },
    {
        'id': 5,
        'nome': 'Sobrancelha',
        'descricao': 'Design e aparação de sobrancelhas masculinas',
        'preco': 15.00,
        'duracao': 20
    },
    {
        'id': 6,
        'nome': 'Pacote Completo',
        'descricao': 'Corte + Barba + Sobrancelha + Lavagem',
        'preco': 75.00,
        'duracao': 90
    }
]

barbeiros = [
    {
        'id': 1,
        'nome': 'Carlos Silva',
        'especialidade': 'Especialista em cortes clássicos',
        'avaliacao': 4.9,
        'imagem': 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=300',
        'experiencia': '8 anos de experiência'
    },
    {
        'id': 2,
        'nome': 'João Santos',
        'especialidade': 'Expert em cortes modernos e barba',
        'avaliacao': 4.8,
        'imagem': 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300',
        'experiencia': '6 anos de experiência'
    },
    {
        'id': 3,
        'nome': 'Pedro Costa',
        'especialidade': 'Especialista em barbas e bigodes',
        'avaliacao': 4.7,
        'imagem': 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=300',
        'experiencia': '10 anos de experiência'
    },
    {
        'id': 4,
        'nome': 'Ricardo Oliveira',
        'especialidade': 'Cortes infantis e adultos',
        'avaliacao': 4.6,
        'imagem': 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300',
        'experiencia': '5 anos de experiência'
    }
]

horarios_disponiveis = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30'
]

@app.route('/')
def index():
    return render_template('index.html', servicos=servicos, barbeiros=barbeiros)

@app.route('/api/cadastro', methods=['POST'])
def cadastro():
    dados = request.get_json()
    
    email = dados.get('email')
    if email in usuarios:
        return jsonify({'erro': 'E-mail já cadastrado'}), 400
    
    usuario = {
        'nome': dados.get('nome'),
        'email': email,
        'telefone': dados.get('telefone'),
        'senha': generate_password_hash(dados.get('senha'))
    }
    
    usuarios[email] = usuario
    session['usuario_logado'] = email
    
    return jsonify({'sucesso': True, 'mensagem': 'Cadastro realizado com sucesso!'})

@app.route('/api/login', methods=['POST'])
def login():
    dados = request.get_json()
    
    email = dados.get('email')
    senha = dados.get('senha')
    
    if email not in usuarios:
        return jsonify({'erro': 'Usuário não encontrado'}), 404
    
    usuario = usuarios[email]
    if not check_password_hash(usuario['senha'], senha):
        return jsonify({'erro': 'Senha incorreta'}), 401
    
    session['usuario_logado'] = email
    return jsonify({'sucesso': True, 'usuario': {
        'nome': usuario['nome'],
        'email': usuario['email'],
        'telefone': usuario['telefone']
    }})

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('usuario_logado', None)
    return jsonify({'sucesso': True, 'mensagem': 'Logout realizado com sucesso!'})

@app.route('/api/servicos')
def get_servicos():
    return jsonify(servicos)

@app.route('/api/barbeiros')
def get_barbeiros():
    return jsonify(barbeiros)

@app.route('/api/horarios/<data>')
def get_horarios(data):
    # Simular horários ocupados
    horarios_ocupados = []
    for agendamento in agendamentos:
        if agendamento['data'] == data:
            horarios_ocupados.append(agendamento['horario'])
    
    horarios_livres = [h for h in horarios_disponiveis if h not in horarios_ocupados]
    return jsonify(horarios_livres)

@app.route('/api/agendar', methods=['POST'])
def agendar():
    if 'usuario_logado' not in session:
        return jsonify({'erro': 'Usuário não autenticado'}), 401
    
    dados = request.get_json()
    
    agendamento = {
        'id': len(agendamentos) + 1,
        'usuario': session['usuario_logado'],
        'servico_id': dados.get('servico_id'),
        'barbeiro_id': dados.get('barbeiro_id'),
        'data': dados.get('data'),
        'horario': dados.get('horario'),
        'status': 'confirmado',
        'data_criacao': datetime.datetime.now().isoformat()
    }
    
    agendamentos.append(agendamento)
    
    return jsonify({'sucesso': True, 'mensagem': 'Agendamento confirmado com sucesso!', 'agendamento': agendamento})

@app.route('/api/meus-agendamentos')
def meus_agendamentos():
    if 'usuario_logado' not in session:
        return jsonify({'erro': 'Usuário não autenticado'}), 401
    
    usuario_email = session['usuario_logado']
    agendamentos_usuario = [a for a in agendamentos if a['usuario'] == usuario_email]
    
    # Enriquecer dados com informações de serviços e barbeiros
    for agendamento in agendamentos_usuario:
        servico = next((s for s in servicos if s['id'] == agendamento['servico_id']), None)
        barbeiro = next((b for b in barbeiros if b['id'] == agendamento['barbeiro_id']), None)
        
        agendamento['servico'] = servico
        agendamento['barbeiro'] = barbeiro
    
    return jsonify(agendamentos_usuario)

@app.route('/api/cancelar-agendamento/<int:agendamento_id>', methods=['DELETE'])
def cancelar_agendamento(agendamento_id):
    if 'usuario_logado' not in session:
        return jsonify({'erro': 'Usuário não autenticado'}), 401
    
    usuario_email = session['usuario_logado']
    
    for i, agendamento in enumerate(agendamentos):
        if agendamento['id'] == agendamento_id and agendamento['usuario'] == usuario_email:
            agendamentos.pop(i)
            return jsonify({'sucesso': True, 'mensagem': 'Agendamento cancelado com sucesso!'})
    
    return jsonify({'erro': 'Agendamento não encontrado'}), 404

@app.route('/api/usuario-atual')
def usuario_atual():
    if 'usuario_logado' not in session:
        return jsonify({'logado': False})
    
    email = session['usuario_logado']
    usuario = usuarios[email]
    
    return jsonify({
        'logado': True,
        'usuario': {
            'nome': usuario['nome'],
            'email': usuario['email'],
            'telefone': usuario['telefone']
        }
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)