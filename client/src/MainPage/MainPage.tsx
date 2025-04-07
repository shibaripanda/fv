import { useEffect, useState } from "react";
import { Form } from "../Form/Form";
import { Button, Textarea } from "@mantine/core";

export interface Doctor {
    name: string
    id: string
    spec: string
}

export interface Slot {
    id: number
    doctor_id: number
    slot: number
}

export interface NewApp {
    id: string
    phone: string
    name: string
}

export default function MainPage(){

    const link = 'http://localhost:5050'

    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [slots, setSlots] = useState<Slot[]>([])
    const [newApp, setNewApp] = useState<NewApp | false>(false)
    const [logs, setLogs] = useState('')

    const getDoctors = async () => {
        fetch(link + '/doctors/get')
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            console.log(res)
            setDoctors(res)
        })
        .catch((er) => {
            alert(`Ошибка: ${er}`)
        })
    }
    const getLogs = async () => {
        try {
          const res = await fetch(link + '/logs/get');
          const data = await res.json();
          setLogs(data.text);
        } catch (error) {
          console.error('Ошибка логов:', error);
        }
    };
    
    const getSlots = async (docid: string) => {
        const params = new URLSearchParams({ docid }).toString();
        fetch(link + `/slots/get?${params}`)
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            console.log(res)
            setSlots(res)
        })
        .catch((er) => {
            alert(`Ошибка: ${er}`)
        })
    }
    const makeApp = async (newApp: Record<string, string>) => {
        const params = new URLSearchParams(newApp).toString();
        fetch(link + `/slots/makeApp?${params}`)
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            console.log(res)
            alert(res.message)
        })
        .catch((er) => {
            console.log(er)
            alert(`Ошибка: ${er}`)
        })
    }
    useEffect(() => {
        getDoctors()
        let isMounted = true;
        const pollLogs = async () => {
        while (isMounted) {
            await getLogs();
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        };
        pollLogs();
        return () => {
        isMounted = false;
        };
      }, [])

    return (
        <>
            <Form 
            doctors={doctors} 
            newApp={newApp} 
            setNewApp={setNewApp}
            getSlots={getSlots}
            slots={slots}
            setSlots={setSlots}
            makeApp={makeApp}
            />
            <Textarea
            style={{margin: '20px'}}
            value={logs}
            placeholder="Logs will be here"
            label="logs"
            autosize
            minRows={2}
            />
            <Button style={{marginLeft: '20px'}} onClick={getLogs}>Update logs</Button>
        </>
    )

}