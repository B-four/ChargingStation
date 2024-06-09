package com.example.chargingstation.usercontrol.control;

import com.example.chargingstation.usercontrol.service.BookmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookmarks")
public class BookmarkControl {
    
    private final BookmarkService bookmarkService;
    
    @Autowired
    public BookmarkControl(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }
    
    @PostMapping("/addBookmark")
    public ResponseEntity<?> addBookmark(@RequestParam int userId, @RequestParam String stationId) {
        try {
            bookmarkService.addBookmark(String.valueOf(userId), stationId);
            return ResponseEntity.ok("Bookmark added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add bookmark");
        }
    }
    
    @DeleteMapping("/deleteBookmark")
    public ResponseEntity<?> deleteBookmark(@RequestParam String userId, @RequestParam String stationId) {
        try {
            bookmarkService.deleteBookmark(userId, stationId);
            return ResponseEntity.ok("Bookmark deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete bookmark");
        }
    }
}