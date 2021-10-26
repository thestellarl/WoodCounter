import serial, socket
from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit, send
import random, json, uuid, time, gspread
gc = gspread.service_account()
from threading import Thread
import queue
sh = gc.open("End Matcher Board Counter")

'''
def push_to_sheets(data):
  sh.values_append('Sheet2!A1', params={'valueInputOption': 'RAW'}, body={ 'values': [[x] for x in data]})
'''
ser = serial.Serial('/dev/ttyUSB0', 9600, bytesize=serial.SEVENBITS, timeout=None, parity=serial.PARITY_EVEN, rtscts=1, dsrdtr=1)

def process_serial():
	board_index = -1
	while True:
		a = ser.read_until(expected=b'\x03')
		packet_start = a.find(b'\x02')
		hex_string = a[packet_start + 1:-1].decode('utf-8')
		hex_flipped = "".join(reversed([hex_string[i:i+2] for i in range(0, len(hex_string), 2)]))
		if len(hex_flipped) == 108:
			board_num = int(hex_flipped[-8:], 16)
			board_len = int(hex_flipped[:8], 16)
			if board_index == -1 or board_num != board_index:
				board_index = board_num
				print('board num', int(hex_flipped[-8:], 16))
				print('board len', int(hex_flipped[:8], 16)/100)
				length = board_len/100
				id = uuid.uuid4()
				sh.values_append('Sheet2!A1', params={'valueInputOption': 'RAW'}, body={ 'values': [[str(id), length]]})
				socketio.send(f"{{\"id\":\"{id}\", \"length\":{length}}}")
				#hex_flipped = "".join(reversed([b[i:i+2] for i in range(0, len(b), 2)]))
				#print(hex_flipped)
				# print(int(hex_flipped, 16))
'''
  for x in range(20):
    data_queue.put(x)
    time.sleep(1)
    id = uuid.uuid4()
    length = random.randint(5, 100)
    sh.values_append('Sheet2!A1', params={'valueInputOption': 'RAW'}, body={ 'values': [[str(id), length]]})
    socketio.send(f"{{\"id\":\"{id}\", \"length\":{length}}}")
  return
'''

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
  socketio.run(app, host="0.0.0.0")
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
