export function getDeviceId(): string {
  try {
    let id = localStorage.getItem('jarvis_device_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      localStorage.setItem('jarvis_device_id', id);
    }
    return id;
  } catch (_) {
    return 'dev_default';
  }
}
