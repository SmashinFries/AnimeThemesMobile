import React, { useCallback, useMemo } from 'react';
import { ListRenderItemInfo, Share, View } from 'react-native';
import {
	BottomSheetBackdrop,
	BottomSheetFlatList,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetView,
	useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Button, Divider, Icon, List, Text, useTheme } from 'react-native-paper';
import * as Linking from 'expo-linking';
import { CustomTrack, GithubReleaseResponse } from '../types';
import TrackPlayer from 'react-native-track-player';
import { sendCompletionToast } from '../utils/toasts';
import { router } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import { downloadAppUpdate } from '../utils/update';
import { Playlist, usePlaylistStore } from '../store/playlists';

type PlayerBottomSheetProps = {
	track: CustomTrack | undefined;
	playlistId?: number;
};
// eslint-disable-next-line react/display-name
export const PlayerBottomSheet = React.forwardRef<BottomSheetModalMethods, PlayerBottomSheetProps>(
	({ track }, ref) => {
		const { colors } = useTheme();
		const { dismiss } = useBottomSheetModal();
		const siteLink = `https://animethemes.moe/anime/${track?.anime?.slug}/${track?.animetheme?.slug}`;

		// const addToPlaylist

		const addToQueue = async () => {
			if (track) {
				dismiss();
				await TrackPlayer.add([track]);
				await sendCompletionToast('Added to Queue!');
			}
		};

		const viewArtist = (slug: string) => {
			dismiss();
			router.navigate('/artist/' + slug);
		};

		const viewAnime = () => {
			dismiss();
			router.navigate('/anime/' + track?.anime?.slug);
		};

		const shareLink = async () => {
			console.log(siteLink ?? 'None');
			await Share.share({ url: siteLink, message: siteLink });
			dismiss();
		};

		return (
			<BottomSheetModal
				ref={ref}
				backgroundStyle={[{ backgroundColor: colors.surface }]}
				handleIndicatorStyle={{ backgroundColor: colors.onSurfaceVariant }}
				enableDynamicSizing
				enableDismissOnClose
				backdropComponent={(props) => (
					<BottomSheetBackdrop
						{...props}
						pressBehavior={'close'}
						disappearsOnIndex={-1}
					/>
				)}>
				<BottomSheetView>
					<View style={{ paddingVertical: 12 }}>
						<List.Item
							title={'Search Spotify'}
							left={(props) => <List.Icon {...props} icon="spotify" />}
							onPress={() =>
								Linking.openURL(
									`https://open.spotify.com/search/${track?.title} ${track?.artist}`,
								)
							}
						/>
						<List.Item
							title={'Add to Playlist'}
							left={(props) => <List.Icon {...props} icon="plus" />}
							onPress={addToQueue}
						/>
						<List.Item
							title={'Add to Queue'}
							left={(props) => <List.Icon {...props} icon="playlist-plus" />}
							onPress={addToQueue}
						/>
						{track?.artistsData?.map((artist, idx) => (
							<List.Item
								key={idx}
								title={`View Artist`}
								description={artist.name}
								left={(props) => <List.Icon {...props} icon="account-outline" />}
								onPress={() => viewArtist(artist.slug)}
							/>
						))}
						<List.Item
							title={'View Anime'}
							onPress={viewAnime}
							left={(props) => <List.Icon {...props} icon="television" />}
						/>
						<List.Item
							title={'Share'}
							left={(props) => <List.Icon {...props} icon="share-variant-outline" />}
							onPress={shareLink}
						/>
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		);
	},
);

// eslint-disable-next-line react/display-name
export const SongBottomSheet = React.forwardRef<BottomSheetModalMethods, PlayerBottomSheetProps>(
	({ track, playlistId }, ref) => {
		const { colors } = useTheme();
		const { dismiss } = useBottomSheetModal();
		const { removeFromPlaylist } = usePlaylistStore();
		const animeLink = `https://animethemes.moe/anime/${track?.anime?.slug}`;
		const shareLink = animeLink + `/${track?.animetheme?.slug}`;

		const addToQueue = async () => {
			if (track) {
				dismiss();
				await TrackPlayer.add([track]);
				await sendCompletionToast('Added to Queue!');
			}
		};

		const viewAnime = () => {
			dismiss();
			router.navigate('/anime/' + track?.anime?.slug);
		};

		const viewArtist = (slug: string) => {
			dismiss();
			router.navigate('/artist/' + slug);
		};

		const shareThemeLink = async () => {
			console.log(shareLink ?? 'None');
			await Share.share({ url: shareLink, message: shareLink });
			dismiss();
		};

		return (
			<BottomSheetModal
				ref={ref}
				backgroundStyle={[{ backgroundColor: colors.surface }]}
				handleIndicatorStyle={{ backgroundColor: colors.onSurfaceVariant }}
				enableDynamicSizing
				enableDismissOnClose
				backdropComponent={(props) => (
					<BottomSheetBackdrop
						{...props}
						pressBehavior={'close'}
						disappearsOnIndex={-1}
					/>
				)}>
				<BottomSheetView>
					<View style={{ paddingVertical: 12 }}>
						<List.Item
							title={'Search Spotify'}
							left={(props) => <List.Icon {...props} icon="spotify" />}
							onPress={() =>
								Linking.openURL(
									`https://open.spotify.com/search/${track?.title} ${track?.artist}`,
								)
							}
						/>
						{/* <List.Item
						title={'Add to Playlist'}
						left={(props) => <List.Icon {...props} icon="plus" />}
						onPress={addToQueue}
					/> */}
						<List.Item
							title={'Add to Queue'}
							left={(props) => <List.Icon {...props} icon="playlist-plus" />}
							onPress={addToQueue}
						/>
						{track?.artistsData?.map((artist, idx) => (
							<List.Item
								key={idx}
								title={'View Artist'}
								description={artist.name}
								onPress={() => viewArtist(artist.slug)}
								left={(props) => <List.Icon {...props} icon="account" />}
							/>
						))}
						<List.Item
							title={'View Anime'}
							onPress={viewAnime}
							left={(props) => <List.Icon {...props} icon="television" />}
						/>
						<List.Item
							title={'Share'}
							left={(props) => <List.Icon {...props} icon="share-variant-outline" />}
							onPress={shareThemeLink}
						/>
						{playlistId !== undefined && playlistId >= 0 && (
							<List.Item
								title={'Remove from List'}
								onPress={() => {
									track && removeFromPlaylist(playlistId, track);
									dismiss();
								}}
								left={(props) => <List.Icon {...props} icon="trash-can-outline" />}
							/>
						)}
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		);
	},
);

type UpdaterBottomSheetProps = {
	updateDetails: GithubReleaseResponse[0] | null;
};
// eslint-disable-next-line react/display-name
export const UpdaterBottomSheet = React.forwardRef<
	BottomSheetModalMethods,
	UpdaterBottomSheetProps
>(({ updateDetails }, ref) => {
	const { colors } = useTheme();
	const { dismiss } = useBottomSheetModal();

	const snapPoints = useMemo(() => ['95%'], []);

	const installUpdate = async () => {
		if (updateDetails?.assets[0]) {
			downloadAppUpdate(
				updateDetails?.assets[0].browser_download_url,
				updateDetails.tag_name,
			);
		}
	};

	return (
		<BottomSheetModal
			ref={ref}
			backgroundStyle={[{ backgroundColor: colors.surface }]}
			handleIndicatorStyle={{ backgroundColor: colors.onSurfaceVariant }}
			enableDismissOnClose
			snapPoints={snapPoints}
			backdropComponent={(props) => (
				<BottomSheetBackdrop {...props} pressBehavior={'close'} disappearsOnIndex={-1} />
			)}>
			<BottomSheetView>
				<View style={{ padding: 10 }}>
					<View
						style={{
							flexDirection: 'row',

							marginVertical: 5,
							alignItems: 'center',
						}}>
						<Icon source={'update'} size={36} color={colors.primary} />
						<View
							style={{
								paddingHorizontal: 12,
								alignItems: 'flex-start',
								justifyContent: 'center',
							}}>
							<Text variant="headlineSmall">New Update Available!</Text>
							<Text variant="labelLarge">Version {updateDetails?.tag_name}</Text>
						</View>
					</View>

					<Divider style={{ height: 2 }} />
				</View>
			</BottomSheetView>
			<BottomSheetScrollView>
				<View style={{ padding: 10 }}>
					<Markdown style={{ body: { color: colors.onSurface } }}>
						{updateDetails?.body}
					</Markdown>
				</View>
			</BottomSheetScrollView>
			<BottomSheetView>
				<Divider style={{ height: 2 }} />
				<View
					style={{
						paddingVertical: 5,
					}}>
					<Button mode="contained" style={{ marginVertical: 5 }} onPress={installUpdate}>
						Update
					</Button>
					<Button mode="outlined" style={{ marginVertical: 5 }} onPress={() => dismiss()}>
						Skip
					</Button>
				</View>
			</BottomSheetView>
		</BottomSheetModal>
	);
});

// eslint-disable-next-line react/display-name
// export const SongCardBottomSheet = React.forwardRef<
// 	BottomSheetModalMethods,
// 	PlayerBottomSheetProps
// >(({ track }, ref) => {
// 	const { colors } = useTheme();
// 	const { dismiss } = useBottomSheetModal();

// 	return (
// 		<BottomSheetModal
// 			ref={ref}
// 			backgroundStyle={[{ backgroundColor: colors.surface }]}
// 			handleIndicatorStyle={{ backgroundColor: colors.onSurfaceVariant }}
// 			enableDynamicSizing
// 			enableDismissOnClose
// 			backdropComponent={(props) => (
// 				<BottomSheetBackdrop {...props} pressBehavior={'close'} disappearsOnIndex={-1} />
// 			)}>
// 			<BottomSheetView>
// 				<View style={{ paddingVertical: 12 }}>
// 					<List.Item
// 						title={'Search Spotify'}
// 						left={(props) => <List.Icon {...props} icon="spotify" />}
// 						onPress={() =>
// 							Linking.openURL(
// 								`https://open.spotify.com/search/${track?.title} ${track?.artist}`,
// 							)
// 						}
// 					/>
// 					{/* <List.Item
// 						title={'Add to Playlist'}
// 						left={(props) => <List.Icon {...props} icon="plus" />}
// 						onPress={addToQueue}
// 					/> */}
// 					<List.Item
// 						title={'Add to Queue'}
// 						left={(props) => <List.Icon {...props} icon="playlist-plus" />}
// 						onPress={addToQueue}
// 					/>
// 					<List.Item
// 						title={'View Anime'}
// 						onPress={viewAnime}
// 						left={(props) => <List.Icon {...props} icon="television" />}
// 					/>
// 					<List.Item
// 						title={'Share'}
// 						left={(props) => <List.Icon {...props} icon="share-variant-outline" />}
// 						onPress={shareThemeLink}
// 					/>
// 				</View>
// 			</BottomSheetView>
// 		</BottomSheetModal>
// 	);
// });

type PlaylistsBottomSheetProps = {
	playlist: Playlist | undefined;
};

// eslint-disable-next-line react/display-name
export const PlaylistsBottomSheet = React.forwardRef<
	BottomSheetModalMethods,
	PlaylistsBottomSheetProps
>(({ playlist }, ref) => {
	const { colors } = useTheme();
	const { dismiss } = useBottomSheetModal();
	const { deletePlaylist } = usePlaylistStore();

	const addToQueue = async () => {
		playlist && TrackPlayer.add(playlist?.tracks);
	};

	const onView = () => {
		console.log('playlist:', playlist);
		if (playlist) {
			router.push({
				pathname: '/(tabs)/playlists/[id]',
				params: { id: playlist.id },
			});
			dismiss();
		}
	};

	const onDelete = () => {
		if (playlist) {
			deletePlaylist(playlist.id);
			dismiss();
		}
	};

	return (
		<BottomSheetModal
			ref={ref}
			backgroundStyle={[{ backgroundColor: colors.surface }]}
			handleIndicatorStyle={{ backgroundColor: colors.onSurfaceVariant }}
			enableDynamicSizing
			enableDismissOnClose
			backdropComponent={(props) => (
				<BottomSheetBackdrop {...props} pressBehavior={'close'} disappearsOnIndex={-1} />
			)}>
			<BottomSheetView>
				<View style={{ paddingVertical: 12 }}>
					<List.Item
						title={'View'}
						left={(props) => <List.Icon {...props} icon="eye" />}
						onPress={onView}
					/>
					<List.Item
						title={'Add to Queue'}
						left={(props) => <List.Icon {...props} icon="playlist-plus" />}
						onPress={addToQueue}
					/>
					{/* <List.Item
						title={'Share'}
						left={(props) => <List.Icon {...props} icon="share-variant-outline" />}
					/> */}
					<List.Item
						title={'Delete'}
						left={(props) => (
							<List.Icon {...props} color={colors.error} icon="trash-can-outline" />
						)}
						onPress={onDelete}
					/>
				</View>
			</BottomSheetView>
		</BottomSheetModal>
	);
});

type PlaylistsAddBottomSheetProps = {
	track?: CustomTrack;
};
// eslint-disable-next-line react/display-name
export const PlaylistsAddBottomSheet = React.forwardRef<
	BottomSheetModalMethods,
	PlaylistsAddBottomSheetProps
>(({ track }, ref) => {
	const { colors } = useTheme();
	// const { dismiss } = useBottomSheetModal();
	const { playlists, addToPlaylist, removeFromPlaylist } = usePlaylistStore();

	const onSelect = useCallback(
		(id: number) => {
			if (track) {
				if (playlists[id].tracks.includes(track)) {
					console.log('Removing', track.title);
					removeFromPlaylist(id, track);
				} else {
					console.log('Adding', track.title);
					addToPlaylist(id, [track]);
				}
			}
		},
		[playlists, track, removeFromPlaylist, addToPlaylist],
	);

	const renderPlaylist = useCallback(
		({ item }: ListRenderItemInfo<Playlist>) => {
			return (
				<List.Item
					title={item.title}
					description={item.description}
					onPress={() => onSelect(item.id)}
					left={(props) => <List.Image {...props} source={{ uri: item.coverImg }} />}
					right={(props) =>
						track && (
							<List.Icon
								{...props}
								icon={
									item.tracks.includes(track)
										? 'checkbox-marked-circle'
										: 'checkbox-blank-circle-outline'
								}
							/>
						)
					}
				/>
			);
		},
		[track, onSelect],
	);

	return (
		<BottomSheetModal
			ref={ref}
			backgroundStyle={[{ backgroundColor: colors.surface }]}
			handleIndicatorStyle={{ backgroundColor: colors.onSurfaceVariant }}
			enableDynamicSizing
			enableDismissOnClose
			backdropComponent={(props) => (
				<BottomSheetBackdrop {...props} pressBehavior={'close'} disappearsOnIndex={-1} />
			)}>
			<BottomSheetFlatList
				data={playlists}
				renderItem={renderPlaylist}
				keyExtractor={({ id }) => id.toString()}
			/>
		</BottomSheetModal>
	);
});
