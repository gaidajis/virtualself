1. **Remove `MusicPlayer.tsx` and `SpotifyPlayer.tsx`**: These files handle ambient sound and music, which the user wants removed.
2. **Remove references to `MusicPlayer` in `App.tsx` and `SpotifyPlayer` in `ZoomView.tsx`**: Clean up any usages of the deleted files.
3. **Remove Bottom Navigation functionality**: Remove `BottomNavigation.tsx` entirely and its usages in `App.tsx`.
4. **Update `App.tsx` layout**: Change the UI to present the "Virtual Me" as a beautified JSON representation instead of fixed buttons. This involves removing the orbit layout and replacing it with a structured, intelligent JSON view of `rawData` with smart actions. (e.g. maps for locations).
5. **Add pre-commit steps**: Ensure everything works.
6. **Submit**: Request approval.
