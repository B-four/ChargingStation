package com.example.chargingstation.usercontrol.service;

import com.example.chargingstation.stationcontrol.entity.Station;
import com.example.chargingstation.stationcontrol.repository.StationRepository;
import com.example.chargingstation.usercontrol.entity.Bookmark;
import com.example.chargingstation.usercontrol.entity.User;
import com.example.chargingstation.usercontrol.repository.BookmarkRepository;
import com.example.chargingstation.usercontrol.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookmarkService
{
    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final StationRepository stationRepository;
    private UserService userService;
    
    @Autowired
    public BookmarkService(BookmarkRepository bookmarkRepository, UserRepository userRepository, StationRepository stationRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.userRepository = userRepository;
        this.stationRepository = stationRepository;
    }
    
    public void addBookmark(String userId, String stationId) throws Exception {
        List<Bookmark> existingBookmarks = getBookmarksByUser(userId);
        for (Bookmark bookmark : existingBookmarks) {
            if (bookmark.getStation().getStatId().equals(stationId)) {
                throw new Exception("Bookmark already exists");
            }
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Station station = stationRepository.findByStatId(stationId);
        if (station == null) {
            throw new IllegalArgumentException("Station not found");
        }
        Bookmark newBookmark = new Bookmark();
        newBookmark.setUser(user);
        newBookmark.setStation(station);
        bookmarkRepository.save(newBookmark);
    }
    
    public void deleteBookmark(String userId, String stationId) throws Exception {
        List<Bookmark> existingBookmarks = getBookmarksByUser(userId);
        Bookmark bookmarkToDelete = null;
        for (Bookmark bookmark : existingBookmarks) {
            if (bookmark.getStation().getStatId().equals(stationId)) {
                bookmarkToDelete = bookmark;
                break;
            }
        }
        if (bookmarkToDelete == null) {
            throw new Exception("Bookmark does not exist");
        }
        bookmarkRepository.delete(bookmarkToDelete);
    }
    
    public List<Bookmark> getBookmarksByUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<Bookmark> bookmarks = bookmarkRepository.findByUser(user);
        bookmarks.forEach(bookmark -> {
            bookmark.getStation().getStatId();
            bookmark.getStation().getChgerId();
        });
        return bookmarks;
    }
    
    public List<Station> getStationsByUser(String userId) {
        List<Bookmark> bookmarks = getBookmarksByUser(userId);
        return bookmarks.stream()
                .map(Bookmark::getStation)
                .collect(Collectors.toList());
    }
}
