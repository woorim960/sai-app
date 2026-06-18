type GameplayNextHandler = () => void;

let activeHandler: GameplayNextHandler | null = null;

export function registerGameplayNextHandler(handler: GameplayNextHandler | null): void {
  activeHandler = handler;
}

export function invokeGameplayNext(): void {
  activeHandler?.();
}
