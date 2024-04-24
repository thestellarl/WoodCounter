import serial, socket
from flask import Flask, render_template, send_from_directory, make_response, request, Response, redirect
from flask_socketio import SocketIO, emit, send
import uuid, gspread, time, random, typing, os
gc = gspread.service_account()
from threading import Thread
sh = gc.open("End Matcher Board Counter")

ser = serial.Serial('/dev/ttyUSB0', 9600, bytesize=serial.SEVENBITS, timeout=None, parity=serial.PARITY_EVEN, rtscts=1, dsrdtr=1)
rounding_accuracy = 0.25
board_length_offset = 0

def is_board_packet(packet: typing.ByteString) -> bool:
  return len(packet) == 108

# Return Total board length @ E2 and average length @ E3
def get_job_stats():
  return sh.get_worksheet_by_id(0).batch_get(['E2', 'E3'])

def generate_mock_data(n: int):
  for _ in range(n):
    print(n)
    time.sleep(2)
    id = uuid.uuid4()
    length = random.randint(5, 100)
    sh.get_worksheet_by_id(1111478912).append_row(values=[str(id), length, 'A'], table_range='A1')
    #sh.values_append('Boards!A1', params={'valueInputOption': 'RAW'}, body={ 'values': [[str(id), length, 'A']]})
    total_length, average_length = get_job_stats()
    socketio.send(f"{{\"id\":\"{id}\", \"length\":{length}, \"totalLength\":{total_length[0][0]}, \"averageLength\":{average_length[0][0]}}}")
  return

def process_serial():
  #generate_mock_data(120)
  board_index = -1
  while True:
    a = ser.read_until(expected=b'\x03')
    packet_start = a.find(b'\x02')
    hex_string = a[packet_start + 1:-1].decode('utf-8')
    hex_flipped = "".join(reversed([hex_string[i:i+2] for i in range(0, len(hex_string), 2)]))
    if is_board_packet(hex_flipped):
      board_num = int(hex_flipped[-8:], 16)
      board_len = int(hex_flipped[:8], 16)
      if board_index == -1 or board_num != board_index:
        board_index = board_num
        print('board num', int(hex_flipped[-8:], 16))
        print('board len', int(hex_flipped[:8], 16)/100)
        #length = board_len/100 - board_length_offset
        length = round( (board_len/100 - board_length_offset)*(1.0/rounding_accuracy))/(1.0/rounding_accuracy)
        id = uuid.uuid4()
        sh.get_worksheet_by_id(1111478912).append_row(values=[str(id), length, 'A'], table_range='A1')
        #sh.values_append('Boards!A1', params={'valueInputOption': 'RAW'}, body={ 'values': [[str(id), length, 'A']]})
        total_length, average_length = get_job_stats()
        socketio.send(f"{{\"id\":\"{id}\", \"length\":{length}, \"totalLength\":{total_length[0][0]}, \"averageLength\":{average_length[0][0]}}}")

def archive_handler(id: str) -> bool:
  try:
    ws = sh.get_worksheet_by_id(1111478912)
    cell = ws.find(id, in_column=0)
    ws.update_acell(f'C{cell.row}', 'B')
    total_length, average_length = get_job_stats()
    socketio.send(f"{{\"totalLength\":{total_length[0][0]}, \"averageLength\":{round(float(average_length[0][0]), 2)}}}")
    return True
  except Exception as e:
    print('Error thrown, Unable to remove')
    print(e)
    return False

def handle_remove(id: str) -> bool:
  try:
    ws = sh.get_worksheet_by_id(1111478912)
    cell = ws.find(id, in_column=0)
    ws.update_acell(f'B{cell.row}', '')
    total_length, average_length = get_job_stats()
    socketio.send(f"{{\"totalLength\":{total_length[0][0]}, \"averageLength\":{round(float(average_length[0][0]), 2)}}}")
    return True
  except Exception as e:
    print('Error thrown, Unable to remove')
    print(e)
    return False

serial_reader_t = Thread(target=process_serial)

def main():
  #socketio.run(app, host="0.0.0.0")
  pass

app = Flask(__name__, static_url_path='')
app.config['SECRET_KEY'] = '29b9105e2bbe005a75c553f5509c3e667b64b374f8591e43576ef66b52d841ba'
serial_reader_t.start()
socketio = SocketIO(app)

@app.route('/static/<path:path>')
def send_js(path):
  return send_from_directory('static', path)

@app.route('/settings', methods=['GET', 'POST'])
def settings():
  global rounding_accuracy, board_length_offset
  if request.method == 'GET':
    return render_template('settings.html', rounding_accuracy=rounding_accuracy, length_offset=board_length_offset)
  if request.method == 'POST':
    rounding_accuracy = float(request.form['acc'])
    board_length_offset = float(request.form['offset'])
    return redirect('/')

@app.route('/')
def index():
  return render_template('index.html')

@socketio.on('connect')
def handle_connect():
  total_length, average_length = get_job_stats()
  socketio.send(f"{{\"totalLength\":{total_length[0][0]}, \"averageLength\":{round(float(average_length[0][0]), 2)}}}")
  print('user connected')

@socketio.on('remove board')
def remove_handler(id):
  if handle_remove(id):
    emit('board removed', id)

@socketio.on('archive board')
def handle_archive(id):
  if archive_handler(id):
    emit('board removed', id)

@socketio.on('shutdown')
def shutdown():
  os.system("sudo shutdown -h now")

@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)
