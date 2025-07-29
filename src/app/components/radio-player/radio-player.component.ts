import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

@Component({
  selector: 'app-radio-player',
  templateUrl: './radio-player.component.html',
  styleUrls: ['./radio-player.component.scss']
})
export class RadioPlayerComponent implements OnInit, OnDestroy {
  private audio: HTMLAudioElement | null = null;
  
  currentTrackIndex = new BehaviorSubject(0);
  isPlaying = new BehaviorSubject(false);

  playlist: Track[] = [
    {
      id: '1',
      title: 'Track 1',
      artist: 'Artist 1',
      url: 'assets/audio/track1.mp3'
    },
    {
      id: '2', 
      title: 'Track 2',
      artist: 'Artist 2',
      url: 'assets/audio/Miley-Cyrys-Wrecking-Ball.mp3'
    },
    {
      id: '3', 
      title: 'Track 3',
      artist: 'Artist 3',
      url: 'assets/audio/Maroon-5-Sugar.mp3'
    }
  ];
  
  get currentTrack() {
    const index = this.currentTrackIndex.value;
    return this.playlist[index] || this.playlist[0] || {
      id: 'default',
      title: 'Radio Stream',
      artist: 'My Radio Station',
      url: ''
    };
  }

  ngOnInit(): void {
    this.initializeAudio();
  }

  private initializeAudio(): void {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    
    this.audio.addEventListener('ended', () => {
      this.playNextTrack();
    });
    
    this.audio.addEventListener('play', () => {
      this.isPlaying.next(true);
    });
    
    this.audio.addEventListener('pause', () => {
      this.isPlaying.next(false);
    });
    
    this.loadRandomTrack();
  }

  private loadRandomTrack(): void {
    if (this.audio && this.playlist.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.playlist.length);
      this.audio.src = this.playlist[randomIndex].url;
      this.currentTrackIndex.next(randomIndex);
    }
  }

  private playNextTrack(): void {
    this.loadRandomTrack();
    if (this.isPlaying.value) {
      this.audio?.play();
    }
  }

  playPause(): void {
    if (!this.audio) return;
    
    if (this.isPlaying.value) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
  }

  ngOnDestroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
} 