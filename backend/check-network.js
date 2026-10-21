const net = require('net');
const socket = new net.Socket();
socket.setTimeout(2500);

socket.on('connect', () => {
  socket.destroy();
  process.exit(0);
});

socket.on('timeout', () => {
  socket.destroy();
  process.exit(1);
});

socket.on('error', () => {
  socket.destroy();
  process.exit(1);
});

socket.connect(5432, 'aws-0-ap-northeast-2.pooler.supabase.com');
