import { useInfiniteQuery } from '@tanstack/react-query';

import { conversationbQueries, formatConversationDate } from '@/entities/conversation';
import { UserAvatar } from '@/entities/user';

import { useInfiniteScroll } from '@/shared/lib/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { ScrollArea } from '@/shared/ui/scroll-area';

const getRelativeDate = (
  daysOffset: number,
  hoursOffset: number = 0,
  minutesOffset: number = 0,
) => {
  const date = new Date();
  date.setDate(date.getDate() - daysOffset);
  date.setHours(date.getHours() - hoursOffset);
  date.setMinutes(date.getMinutes() - minutesOffset);
  return date;
};

// eslint-disable-next-line react-refresh/only-export-components
export const MOCK_CHATS = [
  {
    id: 1,
    name: 'Алексей Смирнов',
    avatar: 'https://i.pravatar.cc/150?u=1',
    lastMessage: 'Привет! Закинул правки в репозиторий, посмотри как будет время.',
    date: getRelativeDate(0, 0, 5), // 5 минут назад
  },
  {
    id: 2,
    name: 'Чат команды (Frontend)',
    avatar: '', // Пустой аватар для проверки AvatarFallback
    lastMessage: 'Максим: Ребят, у кого-нибудь работает локальный сервер? У меня ошибка 500.',
    date: getRelativeDate(0, 0, 45), // 45 минут назад
  },
  {
    id: 3,
    name: 'Елена Дизайнер',
    avatar: 'https://i.pravatar.cc/150?u=3',
    lastMessage: 'Макеты в Фигме обновила. Там новые цвета для кнопок, не забудь выгрузить токены.',
    date: getRelativeDate(0, 2, 0), // 2 часа назад
  },
  {
    id: 4,
    name: 'Михаил (DevOps)',
    avatar: 'https://i.pravatar.cc/150?u=4',
    lastMessage: 'Логи чистые, проблема где-то на фронте. Дебажьте.',
    date: getRelativeDate(0, 5, 30), // 5.5 часов назад
  },
  {
    id: 5,
    name: 'Telegram Notification',
    avatar: 'https://i.pravatar.cc/150?u=50',
    lastMessage: 'Ваш код авторизации: 481516. Не сообщайте его никому.',
    date: getRelativeDate(0, 8, 15), // 8 часов назад
  },

  // --- ВЧЕРА ---
  {
    id: 6,
    name: 'HR Отдел',
    avatar: 'https://i.pravatar.cc/150?u=5',
    lastMessage: 'Не забудьте заполнить опросник eNPS до конца недели! Это займет 2 минуты.',
    date: getRelativeDate(1, 2, 0), // Вчера
  },
  {
    id: 7,
    name: 'Мама',
    avatar: 'https://i.pravatar.cc/150?u=9',
    lastMessage: 'Купи хлеб и молоко по дороге домой. И позвони бабушке!',
    date: getRelativeDate(1, 6, 0), // Вчера
  },
  {
    id: 8,
    name: 'Jira Bot',
    avatar: 'https://i.pravatar.cc/150?u=99',
    lastMessage: "Задача PRJ-1024 переведена в статус 'In Review'.",
    date: getRelativeDate(1, 10, 0), // Вчера
  },

  // --- НА ЭТОЙ НЕДЕЛЕ (Дни недели: Пн, Вт и т.д.) ---
  {
    id: 9,
    name: 'Анна Маркетинг',
    avatar: 'https://i.pravatar.cc/150?u=6',
    lastMessage: 'Тексты для лендинга готовы, отправила на почту.',
    date: getRelativeDate(2), // 2 дня назад
  },
  {
    id: 10,
    name: 'Сергей Бэкенд',
    avatar: 'https://i.pravatar.cc/150?u=7',
    lastMessage: 'API документацию обновил в Swagger. Endpoint для юзеров теперь отдает 200.',
    date: getRelativeDate(3), // 3 дня назад
  },
  {
    id: 11,
    name: 'Заказчик (Игорь)',
    avatar: 'https://i.pravatar.cc/150?u=8',
    lastMessage: 'Всё супер, запускаем в продакшн! Спасибо за оперативность.',
    date: getRelativeDate(4), // 4 дня назад
  },
  {
    id: 12,
    name: 'Клуб любителей настолок',
    avatar: '',
    lastMessage: 'В эту пятницу собираемся у меня. Кто принесет Манчкин?',
    date: getRelativeDate(5), // 5 дней назад
  },
  {
    id: 13,
    name: 'Доставка Еды',
    avatar: 'https://i.pravatar.cc/150?u=15',
    lastMessage: 'Курьер прибыл. Пожалуйста, встретьте его.',
    date: getRelativeDate(6), // 6 дней назад
  },

  // --- ДАВНО (Полные даты: 12 апр, 05 мар и т.д.) ---
  {
    id: 14,
    name: 'Кот Василий',
    avatar: 'https://i.pravatar.cc/150?u=10',
    lastMessage: 'Мяу. Где еда? Когтеточка сама себя не поцарапает.',
    date: getRelativeDate(10), // 10 дней назад
  },
  {
    id: 15,
    name: 'Служба поддержки',
    avatar: 'https://i.pravatar.cc/150?u=11',
    lastMessage: 'Ваше обращение #4591 закрыто. Оцените работу оператора.',
    date: getRelativeDate(15),
  },
  {
    id: 16,
    name: 'Виктор (Аренда)',
    avatar: 'https://i.pravatar.cc/150?u=12',
    lastMessage: 'Деньги получил, спасибо. Счетчики скинешь до 20-го числа.',
    date: getRelativeDate(20),
  },
  {
    id: 17,
    name: 'Тренажерный зал',
    avatar: '',
    lastMessage: 'Напоминаем, что ваш абонемент истекает через 3 дня. Продлить со скидкой 10%?',
    date: getRelativeDate(25),
  },
  {
    id: 18,
    name: 'GitHub Alerts',
    avatar: 'https://i.pravatar.cc/150?u=80',
    lastMessage: 'Dependabot: 3 vulnerabilities found in package-lock.json',
    date: getRelativeDate(30), // Около месяца назад
  },
  {
    id: 19,
    name: 'Олег Таксист',
    avatar: 'https://i.pravatar.cc/150?u=14',
    lastMessage: 'Я подъехал, жду у первого подъезда.',
    date: getRelativeDate(45),
  },
  {
    id: 20,
    name: "Стоматология 'Улыбка'",
    avatar: 'https://i.pravatar.cc/150?u=16',
    lastMessage: 'Ждем вас на профилактический осмотр завтра в 14:00.',
    date: getRelativeDate(60), // 2 месяца назад
  },
  {
    id: 21,
    name: 'Чат подъезда',
    avatar: '',
    lastMessage: 'Кто опять сверлит в 10 вечера?! Имейте совесть!',
    date: getRelativeDate(75),
  },
  {
    id: 22,
    name: 'Госуслуги',
    avatar: 'https://i.pravatar.cc/150?u=90',
    lastMessage: 'Заявление №987654321 принято ведомством.',
    date: getRelativeDate(100),
  },
  {
    id: 23,
    name: 'Интернет Провайдер',
    avatar: 'https://i.pravatar.cc/150?u=22',
    lastMessage: 'На вашем счету осталось менее 100 рублей. Пополните баланс.',
    date: getRelativeDate(120),
  },
  {
    id: 24,
    name: 'Алиса',
    avatar: 'https://i.pravatar.cc/150?u=25',
    lastMessage: 'Окей, поставила будильник на 7:00.',
    date: getRelativeDate(150),
  },
  {
    id: 25,
    name: 'Архивный Проект 2023',
    avatar: '',
    lastMessage: 'Все молодцы, релиз успешен! Уходим на выходные.',
    date: new Date('2023-12-29T18:00:00'), // Очень старое сообщение (прошлый год)
  },
];

export function ConversationList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    conversationbQueries.feed(),
  );

  const { observerTarget } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

  const conversations = data?.pages.flatMap((page) => page.data) ?? [];
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <ScrollArea className="w-full flex-1">
        <div className="flex flex-col">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              className="hover:bg-muted/50 flex cursor-pointer items-center gap-4 border-b p-3 transition-colors last:border-0"
            >
              <UserAvatar avatar={chat.user.avatar} username={chat.user.username} />

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <h3 className="truncate text-sm font-medium">{chat.user.username}</h3>
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {formatConversationDate(chat.createdAt)}
                  </span>
                </div>
                <p className="text-muted-foreground truncate text-sm">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
