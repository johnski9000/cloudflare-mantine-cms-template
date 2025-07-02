export const formatProps = (incomingProps: Record<string, any>) => {
  return Object.values(incomingProps).reduce((acc, prop) => {
    const { key, ...rest } = prop;
    acc[key] = rest; // Keep the entire object, including 'active'
    return acc;
  }, {} as Record<string, any>);
};
