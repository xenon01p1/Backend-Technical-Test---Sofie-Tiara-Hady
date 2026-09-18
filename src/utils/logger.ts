export const logRequest = (
  method: string,
  endpoint: string,
  success: boolean,
  message: string,
  startTime: number
) => {
  const timestamp = new Date().toISOString();
  const duration = Date.now() - startTime;
  const status = success ? '✅' : '❌';

  console.log(
    `${timestamp} | ${status} | ${method} ${endpoint} | ${message} | ${duration}ms`
  );
};