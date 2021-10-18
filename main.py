import serial, socket
from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit, send
import random, json, uuid, time, gspread
gc = gspread.service_account()
from threading import Thread
import queue
sh = gc.open("End Matcher Board Counter")

def push_to_sheets(data):
  sh.values_append('Sheet2!A1', params={'valueInputOption': 'RAW'}, body={ 'values': [[x] for x in data]})

ser = serial.Serial('COM1', 9600, timeout=0, parity=serial.PARITY_EVEN, rtscts=1)

def process_serial():
  for x in range(20):
    data_queue.put(x)
    time.sleep(1)
    id = uuid.uuid4()
    length = random.randint(5, 100)
    sh.values_append('Sheet2!A1', params={'valueInputOption': 'RAW'}, body={ 'values': [[str(id), length]]})
    socketio.send(f"{{\"id\":\"{id}\", \"length\":{length}}}")
  return

def handle_remove(id):
  ws = sh.get_worksheet_by_id(1111478912)
  cell = ws.find(id, in_column=0)
  ws.update_acell(f'B{cell.row}', '')
  return True

data_queue = queue.Queue()
x = Thread(target=process_serial)

  # try:
  #   ser_data = ser.read_until(expected='\x03')
  #   decoded_data = ser_data.decode('utf-8')
  #   packet_start = decoded_data.find('\x02')
  #   if packet_start == -1:
  #     continue
  #   packet_data = decoded_data[packet_start + 1: -1]
  #   board_length = int.from_bytes(packet_data[-8:], byteorder='little')
  # except:
  #   print('Keyboard Interrupt')
  #   break

def main():
  x.start()
  socketio.run(app)    
  pass

app = Flask(__name__, static_url_path='')
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/static/<path:path>')
def send_js(path):
  return send_from_directory('static', path)

@app.route('/')
def index():
  return render_template('index.html')

@socketio.on('connect')
def handle_connect():
  print('user connected')

@socketio.on('remove board')
def handle_connect(id):
  if handle_remove(id):
    emit('board removed', id)

@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)

if __name__ == '__main__':
  main()