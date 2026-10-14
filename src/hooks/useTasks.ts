import { Task } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const TASK_KEY = "@task_key"

export function useTasks(){
    const[tasks, setTasks] = useState<Task[]>([]);

    const [isInitialLoad, setIsInitialLoad] = useState(true);

    //1. carregar dados ao iniciar
    useEffect(() =>{
        const loadTasks = async () =>{
            try{
                const savedTasks = await AsyncStorage.getItem(TASK_KEY);
                if(savedTasks){
                    setTasks(JSON.parse(savedTasks));
                }
            }catch(error){
                console.error("Erro ao carregar as tarefas:", error);
            } finally{
                setIsInitialLoad(false);
            }
        }
        loadTasks();
    }, [])
    
    //2. Salvar dados quando houver mudança (ignorando a primeira carga vazia)
    useEffect(() => {
        if(isInitialLoad) return;

        const saveTasks = async () => {
            try{
                await AsyncStorage.setItem(TASK_KEY, JSON.stringify (tasks));
            } catch(error){
                console.error("Erro ao salvar tarefas:", error)
            }
        };
        saveTasks();
    }, [tasks, isInitialLoad])

    //função adicionar tarefa
    const addTasks = (text: string) =>{
        if(text.trim() === "") return;
        const newTask: Task = {
            id: Date.now().toString(),
            text
        };
        //Atualiza pegando o estado anterior de forma segura
        setTasks((prevTasks) => [...prevTasks,newTask]);
    }

    //função para remover a tarefa
    const removeTask = (id:string) =>{
        setTasks((prevTasks) => 
            prevTasks.filter(item => item.id !== id));
    };

    //função para editar a tarefa
    const editTask = (id: string, newText: string) => {
        if(newText.trim() === "") return;
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? {...task, text:newText} : task
            )
        );
    };

    
    return{
        tasks,
        addTasks,
        removeTask,
        editTask
    }
}