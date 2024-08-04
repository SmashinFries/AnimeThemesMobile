import TrackPlayer, { Event } from 'react-native-track-player';
import { useLastTrackStore } from './store/lastTrack';
// import { useLastTrackStore } from './store/lastTrack';

module.exports = async function () {
	// This service needs to be registered for the module to work
	// but it will be used later in the "Receiving Events" section
	TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());

	TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());

	TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());

	TrackPlayer.addEventListener(Event.RemoteSeek, (data) => {
		TrackPlayer.seekTo(data.position);
	});

	TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (data) => {
		useLastTrackStore.getState().saveTrack(data.track);
	});

	TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (data) => {
		useLastTrackStore.getState().savePosition(data.position);
	});

	// TrackPlayer.addEventListener(Event.PlayerError, (data) => {
	// 	console.log('PlayerError', data);
	// });
};
