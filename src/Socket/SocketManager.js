import NetInfo from '@react-native-community/netinfo';
import {AppState} from 'react-native';
import io from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
    this.userId = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.netInfoUnsubscribe = null;
    this.appStateListener = null;
    this.pendingEmits = [];
  }

  connect(userId) {
    if (this.socket?.connected || this.isConnecting) {
      console.log('Socket already connected/connecting');
      return;
    }

    this.userId = userId;
    this.isConnecting = true;

    if (!this.socket) {
      this.socket = io('http://localhost:3000', {
        transports: ['websocket'],
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 10000,
        randomizationFactor: 0.5,
      });

      this.registerEvents();
    }

    this.socket.connect();
    this.setupAppStateListener();
    this.setupNetworkListener();
  }

  registerEvents() {
    if (!this.socket) {
      return;
    }

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnected = true;
      this.isConnecting = false;

      // Emit join event
      if (this.userId) {
        this.socket.emit('join', {userId: this.userId});
      }

      // Flush queued emits
      this.pendingEmits.forEach(({event, data}) => {
        this.socket.emit(event, data);
      });
      this.pendingEmits = [];
    });

    this.socket.on('disconnect', reason => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;

      if (reason !== 'io client disconnect') {
        console.log('Attempting to reconnect...');
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', err => {
      console.log('Connection error:', err);
      this.isConnecting = false;
    });

    this.socket.on('reconnect', attempt => {
      console.log('Reconnected after', attempt, 'attempts');
    });

    this.socket.on('reconnect_failed', () => {
      console.log('Reconnection failed');
      this.isConnecting = false;
    });

    this.socket.on('reconnect_attempt', attempt => {
      console.log('Reconnect attempt', attempt);
    });

    this.socket.on('reconnecting', attempt => {
      console.log('Reconnecting...', attempt);
    });
  }

  setupAppStateListener() {
    this.appStateListener?.remove();
    this.appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        if (
          nextAppState === 'active' &&
          !this.isConnected &&
          !this.isConnecting
        ) {
          console.log('App foregrounded - reconnecting socket');
          this.socket?.connect();
        }
      },
    );
  }

  setupNetworkListener() {
    this.netInfoUnsubscribe?.();
    this.netInfoUnsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && !this.isConnected && !this.isConnecting) {
        console.log('Network restored - reconnecting socket');
        this.socket?.connect();
      }
    });
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.log('Queueing emit (offline)');
      this.pendingEmits.push({event, data});
    }
  }

  getSocket() {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
    this.removeListeners();
  }

  removeListeners() {
    this.netInfoUnsubscribe?.();
    this.appStateListener?.remove();
    this.netInfoUnsubscribe = null;
    this.appStateListener = null;
  }
}

const socketManager = new SocketManager();
export default socketManager;
