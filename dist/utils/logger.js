export const logRequest = (method, endpoint, success, message, startTime) => {
    const timestamp = new Date().toISOString();
    const duration = Date.now() - startTime;
    const status = success ? '✅' : '❌';
    console.log(`${timestamp} | ${status} | ${method} ${endpoint} | ${message} | ${duration}ms`);
};
