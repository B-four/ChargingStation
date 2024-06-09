package com.example.chargingstation.usercontrol.control;

import com.example.chargingstation.stationcontrol.entity.Station;
import com.example.chargingstation.usercontrol.entity.Bookmark;
import com.example.chargingstation.usercontrol.service.BookmarkService;
import com.example.chargingstation.usercontrol.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bookmarks")
public class BookmarkControl {
    
    private final BookmarkService bookmarkService;
    private final UserService userService;
    
    @Autowired
    public BookmarkControl(BookmarkService bookmarkService, UserService userService) {
        this.bookmarkService = bookmarkService;
        this.userService = userService;
    }
    
    @PostMapping("/addBookmark")
    public ResponseEntity<?> addBookmark(@RequestParam String username, @RequestParam String stationId) {
        try {
            String userId = String.valueOf(userService.findByUsername(username).getUser_id());
            bookmarkService.addBookmark(userId, stationId);
            return ResponseEntity.ok("Bookmark added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    
    @DeleteMapping("/delBookmark")
    public ResponseEntity<?> deleteBookmark(@RequestParam String username, @RequestParam String stationId) {
        try {
            String userId = String.valueOf(userService.findByUsername(username).getUser_id());
            bookmarkService.deleteBookmark(userId, stationId);
            return ResponseEntity.ok("Bookmark deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    
    @GetMapping("/getBookmarksByUser")
    public ResponseEntity<?> getBookmarksByUser(@RequestParam String username) {
        try {
            String userId = String.valueOf(userService.findByUsername(username).getUser_id());
            List<Bookmark> bookmarks = bookmarkService.getBookmarksByUser(userId);
            List<Station> bookmarkList = bookmarks.stream()
                    .map(Bookmark::getStation)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(bookmarkList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to get bookmarks");
        }
    }
    
    /*@GetMapping("/getBookmarksByUser")
    public ResponseEntity<?> getBookmarksByUser(@RequestParam String username) {
        try {
            List<Station> bookmarkList = bookmarkService.getStationsByUser(username);
            return ResponseEntity.ok(bookmarkList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }*/
}