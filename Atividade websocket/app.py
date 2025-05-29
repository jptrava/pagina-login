from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'segredo'
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('send_message')
def handle_send_message(data):
    print(f"Mensagem de {data['username']}: {data['message']}")
    emit('receive_message', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host="10.120.73.107", port=8000, debug=True)
