// import { addDay, addHour, offset, format } from '@formkit/tempo';

export const doctors = [
  { name: 'Аркадий Сумкин', spec: 'Хирург' },
  { name: 'Виолета Клофелинова', spec: 'Психиатр' },
  { name: 'Антон Запойный', spec: 'Нарколог' },
  { name: 'Иван Колдрексович', spec: 'Терапевт' },
  { name: 'Рита Неразборчивая', spec: 'Виниролог' },
  { name: 'Федор Плотников', spec: 'Паталогоанатом' },
];

export const slots = [];

export function getSlots(countHours, countDays) {
  const now = new Date();
  now.setDate(now.getDate() + countDays);
  now.setHours(countHours, 0, 0, 0);
  const unixTime = now.getTime();
  return Math.floor(unixTime / 1000);
}

export function getPrettyTime(time) {
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

// export function getTimeFuture(h, d) {
//   const date = format(new Date(), 'full');
//   console.log(offset(new Date()))
//   console.log(new Date())
//   console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)

//   console.log(date);
//   // const x = addDay(addHour(tempo(), h), d);
//   // return x;
// }
