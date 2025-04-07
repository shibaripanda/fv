import {
    Button,
    Container,
    NumberInput,
    Paper,
    Select,
    TextInput,
    Title,
  } from '@mantine/core';
  import classes from './Form.module.css';
import { Doctor, NewApp, Slot } from '../MainPage/MainPage';
import { useState } from 'react';

interface FormProps {
    doctors: Doctor[]
    newApp: NewApp | false
    setNewApp: any
    getSlots: any
    slots: Slot[]
    setSlots: any
    makeApp: any
}
  
  export const Form: React.FC<FormProps> = ({doctors, newApp, setNewApp, getSlots, slots, setSlots, makeApp}) => {

    console.log(newApp)


    const [slotInput, setSlotInput] = useState<{label: String, value: string} | false>(false)

    function getPrettyTime(time: number){
      const options: any = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
      };
      return new Date(time * 1000).toLocaleString('ru', options);
    }

    function slotTime(){
      if(slots.length){
        return (
          <Select
          withAsterisk
          value={slotInput ? slotInput.value : ''}
          label="Date Time"
          placeholder="Pick Date Time"
          data={slots.map(item => ({ label: getPrettyTime(item.slot), value: item.id.toString()}))}
          onChange={(_value, option) => {
            console.log(option)
            setSlotInput(option)
            setNewApp({id: option.value, phone: newApp ? newApp.phone : '', name: newApp ? newApp.name : ''})
          }}
          />
        )
      }
    }

    function namePhone(){
      const icon = <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /></svg>
      if(newApp){
          return (
            <>
            <TextInput
            withAsterisk
              // value={slotInput ? slotInput.value : ''}
              label="Name"
              placeholder="Name"
              onChange={(event) => {
                setNewApp({...newApp, name: event.target.value})
              }}
              />
              <NumberInput
              withAsterisk
              // value={slotInput ? slotInput.value : ''}
              prefix='+'
              rightSection={icon}
              label="Phone"
              placeholder="Phone"
              onChange={(event) => {
                setNewApp({...newApp, phone: '' + event})
              }}
              />
            </>
          )
        }
    }

    return (
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Doctor appointment
        </Title>
  
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">

          <Select
          withAsterisk
          label="Doctor"
          placeholder="Pick doctor"
          data={doctors.map(item => ({ label: item.name + ' (' + item.spec + ')', value: item.id}))}
          onChange={(_value, option) => {
            setSlots([])
            setNewApp(newApp ? {...newApp, id: ''} : false)
            setSlotInput(false)
            getSlots(option.value)
          }}
          />

         {slotTime()}
         {namePhone()}



          <Button 
          fullWidth mt="xl" 
          disabled={!newApp || !newApp.id || !newApp.phone || !newApp.name}
          onClick={() => {
            makeApp(newApp)
          }}
          >
          Create appointment
          </Button>
        </Paper>
      </Container>
    );
  }