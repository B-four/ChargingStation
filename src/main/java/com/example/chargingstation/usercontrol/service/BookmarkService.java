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

@Service
public class BookmarkService
{
    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final StationRepository stationRepository;
    
    @Autowired
    public BookmarkService(BookmarkRepository bookmarkRepository, UserRepository userRepository, StationRepository stationRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.userRepository = userRepository;
        this.stationRepository = stationRepository;
    }
    
    public void addBookmark(String userId, String stationId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Station station = stationRepository.findByStatId(stationId);
        if (station == null) {
            throw new IllegalArgumentException("Station not found");
        }
        
        Bookmark bookmark = new Bookmark();
        bookmark.setUser(user);
        bookmark.setStation(station);
        
        bookmarkRepository.save(bookmark);
    }
    
    public void deleteBookmark(String userId, String stationId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Station station = stationRepository.findByStatId(stationId);
        if (station == null) {
            throw new IllegalArgumentException("Station not found");
        }
        
        Bookmark bookmark = bookmarkRepository.findByUserAndStation(user, station).orElseThrow(() -> new IllegalArgumentException("Bookmark not found"));
        
        bookmarkRepository.delete(bookmark);
    }
    
    public List<Bookmark> getBookmarksByUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        return bookmarkRepository.findByUser(user);
    }
}
