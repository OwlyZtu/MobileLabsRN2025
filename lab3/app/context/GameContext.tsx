import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

export type TaskType =
  | "click"
  | "doubleClick"
  | "longPress"
  | "drag"
  | "swipeRight"
  | "swipeLeft"
  | "pinch"
  | "points";

export interface Task {
  id: number;
  name: string;
  description: string;
  progress: number;
  target: number;
  type: TaskType;
  completed: boolean;
}

interface GameContextType {
  points: number;
  addPoints: (amount: number) => void;
  tasks: Task[];
  updateTaskProgress: (taskType: TaskType, amount?: number) => void;
  currentImage: number;
  setCurrentImage: React.Dispatch<React.SetStateAction<number>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [points, setPoints] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: "Котяча Лапка",
      description: "Торкніться лапкою 10 разів як грайливе кошеня",
      progress: 0,
      target: 10,
      type: "click",
      completed: false,
    },
    {
      id: 2,
      name: "Радісні Стрибки",
      description: "Подвійний дотик, як кіт, що побачив смаколики, 5 разів",
      progress: 0,
      target: 5,
      type: "doubleClick",
      completed: false,
    },
    {
      id: 3,
      name: "Лінивий Котик",
      description: "Затримайте як сонний котик на 3 секунди",
      progress: 0,
      target: 1,
      type: "longPress",
      completed: false,
    },
    {
      id: 4,
      name: "Клубочок Пригод",
      description: "Перетягніть, ніби граєтесь з клубком пряжі",
      progress: 0,
      target: 1,
      type: "drag",
      completed: false,
    },
    {
      id: 5,
      name: "Цікава Лапка",
      description: "Проведіть вправо, як скидаючи речі зі столу",
      progress: 0,
      target: 1,
      type: "swipeRight",
      completed: false,
    },
    {
      id: 6,
      name: "Пустотливий Змах",
      description: "Проведіть вліво, ховаючи іграшки під диван",
      progress: 0,
      target: 1,
      type: "swipeLeft",
      completed: false,
    },
    {
      id: 7,
      name: "Котик-Потягусик",
      description: "Розтягніться як кіт після сну",
      progress: 0,
      target: 1,
      type: "pinch",
      completed: false,
    },
    {
      id: 8,
      name: "Збирач Смаколиків",
      description: "Зберіть 100 котячих смаколиків",
      progress: 0,
      target: 100,
      type: "points",
      completed: false,
    },
  ]);

  const updateTaskProgress = (taskType: TaskType, amount: number = 1): void => {
    const completedTasks = tasks.filter((task) => task.completed).length;
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.type === taskType && !task.completed) {
          const newProgress =
            task.type === "points"
              ? Math.min(points, task.target)
              : Math.min(task.progress + amount, task.target);
          const completed = newProgress >= task.target;
          if (completed && !task.completed) {
            setCurrentImage(completedTasks + 1);
          }

          return {
            ...task,
            progress: newProgress,
            completed: completed,
          };
        }
        return task;
      })
    );
  };

  useEffect(() => {
    updateTaskProgress("points");
  }, [points]);

  const addPoints = (amount: number): void => {
    setPoints((prev) => prev + amount);
  };

  return (
    <GameContext.Provider
      value={{
        points,
        addPoints,
        tasks,
        updateTaskProgress,
        currentImage,
        setCurrentImage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
