import io from 'socket.io-client'

const socket = io(process.env.REACT_APP_SERVER_SOCKET, { transports: ["websocket"] });

/*
      
    Dòng này để fix lỗi: Load lại trang dẫn tới mất danh sách chat
      
      [Problem] 
        + Khi load lại trang socket trước bị mất kết nối và sau đó kết nối lại (socket id được làm mới)
        + Bên phía server cũng nhận được tín hiệu (connection)
        + getContacts (server) chỉ gửi danh sách chat đến socket id được thêm từ 'add-user'
        
        => Do đó bên server không tìm được socket.id nào

      [Fix] Thêm socket.id mỗi khi kết nối
    
*/

export default socket