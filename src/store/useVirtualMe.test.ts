import test from 'node:test';
import assert from 'node:assert/strict';
import { useVirtualMe } from './useVirtualMe.ts';
import type { Memory, UserProfile } from '../types/index.ts';

// Helper to reset store before each test
const resetStore = () => {
  useVirtualMe.setState(useVirtualMe.getInitialState());
};

test('store initialization', () => {
  resetStore();
  const state = useVirtualMe.getState();
  assert.equal(state.activeContext, 'PUBLIC');
  assert.equal(state.isPanelOpen, false);
  assert.equal(state.isTransitioning, false);
  assert.equal(state.memories.length, 0);
  assert.equal(state.userProfile, null);
});

test('setActiveContext', () => {
  resetStore();
  useVirtualMe.getState().setActiveContext('PRIVATE');
  const state = useVirtualMe.getState();
  assert.equal(state.activeContext, 'PRIVATE');
  assert.equal(state.isTransitioning, true);
});

test('user profile management', () => {
  resetStore();
  const profile: UserProfile = {
    id: 'user-1',
    userId: 'user-1',
    fullName: 'Test User',
    contexts: [],
    activeContext: 'PUBLIC',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  };

  useVirtualMe.getState().setUserProfile(profile);
  assert.deepEqual(useVirtualMe.getState().userProfile, profile);

  useVirtualMe.getState().updateUserProfile({ fullName: 'Updated Name' });
  assert.equal(useVirtualMe.getState().userProfile?.fullName, 'Updated Name');
});

test('memory CRUD operations', () => {
  resetStore();
  const memory: Memory = {
    id: 'm-1',
    type: 'memory',
    title: 'First Memory',
    description: 'Test description',
    confidence: 'confirmed',
    isUserConfirmed: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdBy: 'user-1',
    visibility: 'private'
  };

  // Add
  useVirtualMe.getState().addMemory(memory);
  assert.equal(useVirtualMe.getState().memories.length, 1);
  assert.deepEqual(useVirtualMe.getState().memories[0], memory);

  // Update
  useVirtualMe.getState().updateMemory('m-1', { title: 'Updated Memory' });
  assert.equal(useVirtualMe.getState().memories[0].title, 'Updated Memory');
  assert.equal(useVirtualMe.getState().memories.length, 1);

  // Delete
  useVirtualMe.getState().deleteMemory('m-1');
  assert.equal(useVirtualMe.getState().memories.length, 0);
});

test('getFilteredData utility', () => {
  resetStore();

  const memories: Memory[] = [
    {
      id: 'public-mem',
      type: 'memory',
      title: 'Public',
      description: '',
      confidence: 'confirmed',
      isUserConfirmed: true,
      createdAt: '',
      updatedAt: '',
      createdBy: 'user-1',
      visibility: 'public'
    },
    {
      id: 'private-mem',
      type: 'memory',
      title: 'Private',
      description: '',
      confidence: 'confirmed',
      isUserConfirmed: true,
      createdAt: '',
      updatedAt: '',
      createdBy: 'user-1',
      visibility: 'private'
    }
  ];

  useVirtualMe.getState().setViewerContext({
    viewerUserId: 'user-1',
    isAuthenticated: true,
    grantedPermissions: ['public', 'private']
  });

  // PRIVATE context shows everything
  let filtered = useVirtualMe.getState().getFilteredData(memories, 'PRIVATE');
  assert.equal(filtered.length, 2);

  // PUBLIC context shows only public with proper perms
  filtered = useVirtualMe.getState().getFilteredData(memories, 'PUBLIC');
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'public-mem');

  // Test when viewer lacks permission
  useVirtualMe.getState().setViewerContext({
    viewerUserId: 'user-2',
    isAuthenticated: true,
    grantedPermissions: ['public']
  });

  // Even if they request something requiring 'private', getFilteredData filters based on context perms
  // If we require 'private', they shouldn't get it
  filtered = useVirtualMe.getState().getFilteredData(memories, 'DATING', 'private');
  assert.equal(filtered.length, 0);
});

test('UI and Zoom states', () => {
  resetStore();

  useVirtualMe.getState().setIsPanelOpen(true);
  assert.equal(useVirtualMe.getState().isPanelOpen, true);

  useVirtualMe.getState().setZoom({ isZoomed: true, zoomScale: 2, zoomTarget: 'timeline' });
  const zoomState = useVirtualMe.getState().zoom;
  assert.equal(zoomState.isZoomed, true);
  assert.equal(zoomState.zoomScale, 2);
  assert.equal(zoomState.zoomTarget, 'timeline');

  useVirtualMe.getState().resetZoom();
  const resetZoomState = useVirtualMe.getState().zoom;
  assert.equal(resetZoomState.isZoomed, false);
  assert.equal(resetZoomState.zoomScale, 1);
  assert.equal(resetZoomState.zoomTarget, null);
  assert.equal(useVirtualMe.getState().activeCluster, null);
  assert.equal(useVirtualMe.getState().selectedCluster, null);
});
