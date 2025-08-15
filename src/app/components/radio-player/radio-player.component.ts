import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import  {RadioSchedulerService, Track } from 'src/app/services/radioSchedulerService.service';

@Component({
  selector: 'app-radio-player',
  templateUrl: './radio-player.component.html',
  styleUrls: ['./radio-player.component.scss']
})
export class RadioPlayerComponent implements OnInit, OnDestroy {
  private audio: HTMLAudioElement | null = null;
  
  currentTrackIndex = new BehaviorSubject(0);
  isPlaying = new BehaviorSubject(false);

  playlist: Track[] = [];
  
  get currentTrack() {
    const index = this.currentTrackIndex.value;
    return this.playlist[index] || this.playlist[0] || {
      id: 'default',
      title: 'Radio Stream',
      artist: 'My Radio Station',
      url: ''
    };
  }

  constructor(private radioSchedulerService: RadioSchedulerService) {}

  ngOnInit(): void {
    this.initializeAudio();

    this.radioSchedulerService.loadTracks().subscribe(tracks => {
		this.playlist = tracks;
		this.loadRandomTrack();
	});
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
    
    this.loadRandomTrack();
  }

  private loadRandomTrack(): void {//TODO: fix random to play music without duplicates
    if (this.audio && this.playlist.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.playlist.length);
      this.audio.src = this.playlist[randomIndex].url;
      this.currentTrackIndex.next(randomIndex);
    }
  }

  private playNextTrack(): void {
    this.loadRandomTrack();
    this.audio?.play();
  }

  playPause(): void {
    if (!this.audio) return;
    
    if (this.isPlaying.value) {
      this.audio.pause();
      this.isPlaying.next(false);
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