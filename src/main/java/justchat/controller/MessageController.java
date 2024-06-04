package justchat.controller;

import justchat.JustChatApplication;
import justchat.model.Message;
import justchat.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import justchat.model.FileInfo;
import justchat.model.Session;
import justchat.model.User;
import justchat.repository.FileInfoRepository;
import justchat.repository.SessionRepository;
import justchat.repository.UserRepository;
import justchat.util.ByteUtils;
import org.springframework.web.socket.TextMessage;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/user/{username}/messages")
public class MessageController {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ByteUtils byteUtils;

    @Autowired
    private WebsocketController websocketController;

    @Autowired
    private FileInfoRepository fileInfoRepository;

    @Autowired
    private MessageRepository messageRepository;

//    @GetMapping
//    public List<Message> getAllMessages(HttpServletRequest request, @PathVariable String username) {
//        return messageService.getAllMessages(username);
//    }

//    @GetMapping("/from/{date}")
//    public List<Message> getMessagesFromDate(HttpServletRequest request, @PathVariable String username, @PathVariable @DateTimeFormat(pattern="yyyy-MM-dd") Date date) {
//        return messageService.getMessagesFromDate(username, date);
//    }

    @GetMapping("/from/{start_time}/to/{end_time}")
    public String getMessagesFromDateToDate(HttpServletRequest request, @PathVariable String username, @PathVariable long start_time, @PathVariable long end_time) throws IOException {
        HttpSession httpSession = request.getSession();
        Session session = sessionRepository.findById(httpSession.getId()).get();
        User me = session.getUser();

        String currentSideUsername = me.getUsername();
        String otherSideUsername = username;

        List<Message> messages;
        if (JustChatApplication.broadcastUsername.equals(otherSideUsername)) {
            messages = messageRepository.fetchMessages(websocketController.loadingMessagesChunksize, otherSideUsername, start_time, end_time);
        } else {
            messages = messageRepository.fetchMessages(websocketController.loadingMessagesChunksize, currentSideUsername, otherSideUsername, start_time, end_time);
        }
        Collections.reverse(messages);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < messages.size(); i++) {
            Message m = messages.get(i);
            if (m.isTextMessage()) {
                sb.append(websocketController.createTextMessageUIComponent(m, currentSideUsername.equals(m.getSenderUsername())));
            } else {
                sb.append(websocketController.createFileMessageUIComponent(m, currentSideUsername.equals(m.getSenderUsername())));
            }
        }
        return sb.toString();
    }
}