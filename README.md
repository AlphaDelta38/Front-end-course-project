# Documentation of course project  2024/2025



## 📌 General

- ### [🛠 Technologies](#project-technologies)
- ### [📖 Documentation](#-Documentation)




# 🛠 Project Technologies

## Main technologies
<div style="display: flex; gap: 16px; flex-wrap: wrap">
    <img width="30px" height="30px" style="vertical-align: middle;" 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png"
    />
    <img width="px" height="30px" style="vertical-align: middle;" 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/512px-Typescript_logo_2020.svg.png"
    />
    <img width="140px" height="30px" style="vertical-align: middle;" 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Redux_Logo.png/800px-Redux_Logo.png"
    />
</div>

## Libraries used:

- ### **RTK query** - Основний інструмент для керування запитами на back-end і кешування даних.
- ### **Axios** - допоміжний інструмент для запитів на back-end.
- ### **yup** - бібліотека для валідації даних об'єктів / форм.
- ### **React-Hook-Form** - бібліотека для покращеного керування формами та їх оптимізації.
- ### **React Quill** - простий і потужний WYSIWYG-редактор.
- ### **JWT decode** - для декодування інформації з JWT token.
- ### **Gsap (free version)** - для зручного керування якорями та скролом сайту.




# 📖 Documentation

## 📌 Sections

- ### [📂 Structure](#structure-of-project)
- ### [🔀 Routing](#-routing)
- ### [⚙️ Utils](#-function-utils)
- ### [🧩 Useful Components](#-useful-components)
- ### [🔧📍 Admin panel Routing](#-admin-panel-routing)
- ### [❌ Error Handler](#-error-handler)




## 📂 Structure of project

```bash
project-root/
│── public
│   ├── others img                    # Усі img / video / gif
│   └── sprite.svg                    # Усі svg-іконки знаходяться в цьому файлі 
│── src/                              # Вихідний код проєкту
│   ├── components/                   # Повторно використовувані React-компоненти
│   │   └──additionalComponents/      # Додаткові компоненти, які використовуються в інших              
│   ├── hooks/                        # Кастомні хуки React
│   ├── modules/                      # CSS Modules для всіх React-компонентів
│   ├── services/                     # Усі сервіси для керування запитами до Back-end за допомогою RTK Query
│   ├── store/                        # Містить Redux store та reducers
│   │    ├──reducers/                 # Містить усі slices для керування Redux Store, а також actionCreators
│   │    └──store.ts                  # Redux Store та підключення всіх сервісів RTK Query 
│   ├── types/                        # Містить майже всі типи застосунку та сервісів 
│   ├── utils/                        # Допоміжні функції
│   ├── global.d.ts                   # Файл для додаткового декларування TS 
│   ├── App.tsx                       # Головний компонент застосунку
│   │   index.tsx                     # Точка входу до застосунку
│   └── routes.ts                     # Усі маршрути застосунку, а також компоненти, прив'язані до них
├── .env                              # Файл змінних середовища
├── package.json                      # Файл залежностей
└── README.md                           # Документація проєкту                   
```
### Додаткова інформація Sprite
📂Public - включає в себе sprite, в якому в свою чергу зберігаються всі svg icon у форматі:
```tsx
// Зовнішня оболонка нашої іконки змінюється з svg --> symbol, все інше залишається так само
// так само привласнюємо нашій іконці id, який відображатиме її сенс
<symbol id="StarIcon" width="100%" height="100%" viewBox="0 0 40 35">
    <path d="M20 0L26.4656 10.5458LL8.287L13.5344 10.5458L20 0Z"/>
</symbol>
```
### Пример использования Icons
```tsx
//Звертаємося як /sprite.svg, і добвляємо « # » разом з id іконки
<svg className={cl.PCandPhoneIcon}>
  <use xlinkHref={"/sprite.svg#PCAndPhoneIcon"}></use> 
</svg>
```

#

---

## 🔀 Routing

### P.S Усі маршрути додатка зберігаються в routesEnum, який знаходиться в types/routes.type.ts

### Структура маршруту в додатку повинна мати вигляд масиву з такими об'єктами:

```tsx    
{
    path: routesEnum.general /*url який буде прив'язаний до компонента*/
    element: GeneralPage /* Компонент, який буде відображатися за цим маршрутом*/
}   
```
### Приклад реализації:
```tsx
export const loginRoutes = [
    {path: routesEnum.general, element: GeneralPage},
    //..other
]


export const unLoginRoutes = [
    {path: routesEnum.login, element: AuthPage},
    {path: routesEnum.registration, element: AuthPage},
    //..other
]


export const onlyForDoctors = [
    {path: routesEnum.admin, element: AdminPanel},
    //..other
]
```
### Використання в App.tsx:


```tsx
<Routes>
    {
        data.id !== 0 /// Умова відображення основного маршруту (Визначення авторизації)
                ? /// Отрисовка Route з нашими заданими маршрутами в константі з routes.ts
        loginRoutes.map((value, index)=><Route key={index} path={value.path} element={<value.element/>} />) 
        : 
        unLoginRoutes.map((value, index)=><Route key={index} path={value.path} element={<value.element/>} />)
    }
    {  
        data.roles && data?.roles?.length > 0 &&  /// Додаткова умова для додаткових доступів до шляхів
            onlyForDoctors.map((value, index)=><Route key={index} path={value.path} element={<value.element/>} />)
    }
</Routes>
```


--- 

## ⚙️ Function Utils
###
### 🔹 Date  Utils:

- ### ```dateConvert(date: string)```  
  значенням приймає будь-який формат дати підтримуваний new Date(), у відповідь повертає «February 16, 2025» - «month, day, year»
###
- ### ```convertToInputTypeDate(isoDate: string)``` 
  значенням приймає дату формату ISO, як значення повертає дату у форматі YYYY-MM-DD <br/>
  ### _**Example:**_ 2025-02-17 для використання цього формату в input value
###
- ### ```formatDateForInput(dateString: string)``` 
  значенням приймає будь-який формат дати підтримуваний new Date(), у відповідь повертає YYYY-MM-DD <br/>
  ### _**Example:**_ 2025-02-17 
###
- ### ```calculateAge(birthDate: string)```
  значенням приймає будь-який формат підтримуваний new Date(), повертає скільки років минуло з цього часу, інакше кажучи вік

#
### 🔹 Text  Utils:

- ### ```cleanSpaces(str: string)```
  параметром приймає будь-який рядок і видаляє зайві пробіли, залишаючи по одному між словами **P.S Якщо до цього вони там були** <br/>
  ### _**Example:**_ ㅤ  "ㅤㅤtext ㅤㅤbeforeㅤㅤ"  ㅤ-->ㅤ  "text after"
###
- ### ```containsSubstring(input: string,  query: string)```
  параметрами приймає input і query, функція перевіряє чи знаходиться query в тексті input <br/>
  і повертає логічний результат true / false

#
### 🔹 Color  Utils:

- ### ```generateRandomColorWithCross()```
  повертає рандомний колір у форматі rgb(r,g,b); <br/>
  ### _**Example:**_  rgb(0,0,0);



### 🔹Bounce  Utils:

- ### ```deBounceWithConfirmation(deBounceFunc: functionsType)```
  функція викликає модальне вікно в додатку, з вибором так чи ні, достатньо передати її
  в onClick разом з основною функцією для якої ми хочемо отримати підтвердження, параметром приймає виклик основної функції через стрілочну ()=>function(), або ж посилання на функцію<br/>
  ### _**Example:**_ 
  ```tsx
                                //Наша фукнція //// основна функція як параметр у вигляді стрілочної фукнції з викликом основної
        <CustomBtn onClick={()=>deBounceWithConfirmation(()=>doctorController())}/>
                                //Наша фукнція ///така сама функція але вже у вигляді посилання
        <CustomBtn onClick={()=>deBounceWithConfirmation(doctorController)}/>
  ```
  **_P.S_** Функція працює в будь-якій частині додатка там, де її може бути викликано.

###

#

---

## 🧩 Useful Components
###


### 🔹 Loader - анимація завантаження

Loader - використовують для наглядного прикладу того , що йде завантаження, і процес не зупинено.

###

#### **_Приклад використання:_**
```tsx
    <Loader 
        isLoading={true}    // true / false 
        isChildElement={false}   // true / false
    />
```
- #### _**isLoading**_ відповідає за показування елемента true - показує , false - приховує елемент
- #### **_isChildElement_** впливає на те, де буде показуватися Loader, true - на найближчому батьку <br/> з position relative, false - зі свого боку на всьому екрані тобто від viewport, бо має position fixed
###

### 🔹 QuillForm - WYSIWYG-редактор.

QuillForm - редактор, який дає змогу легко і просто реалізувати щось на кшталт Word документа.
так само що б формат тексту, який був створений за допомогою QuillForm, потрібно використовувати його ж для відображення, але вказавши при цьому toolbarActive - false, readonly - true
###

#### **_Приклад використання:_**
```tsx
  <QuillForm value={editorValue} setValue={setEditorValue} toolbarActive={true} readonly={false} style={{height:"400px"}}/>
```
- #### _**value**_ для передачі даних у редактор
- #### _**setValue**_ функція яка приймає єдиний параметр типу string (Дані з редактора)
- #### _**toolbarActive**_ якщо потрібно вимкнути панель з керуванням редактора ставимо false
- #### _**readonly**_ забороняє повністю будь-яким чином редагувати дані в редакторі.
- #### _**style**_ передача власних додаткових стилів, які застосовуються на container навколо QuillForm

###

### 🔹 SoloInputModalWindow - Модальне вікно з єдиним полем введення.

SoloInputModalWindow - компонент який дає змогу легко використовувати модальне вікно з input і підтвердженням дії так / ні,<br/>
при підтвердженні, компонент повертає string даних що були введені в input.

#### **_Приклад використання:_**
```tsx
{
    active && /// наш стан активності 
    <SoloInputModalWindow
            closeCallBackFunc={(active: boolean) => {  /// callback функція, яка приймає стан вікна true - on, false - off
              setActive(active)   // передаємо стан із компонента
            }}
            acceptCallBackFunc={(value) => { /// callback яка приймає значення з input
              someFunction(value)  /// використовуємо в потрібній функції
            }}
    />
}
```
**P.S Як callback можна передати і звичайне посилання на фукнцію, яка прийматиме значення, залежить від ситуації**

###


### 🔹 customBtn - Кнопка з пресетами.

customBtn - компонент, який має пресети Update / Delete / Create, а також її можна повністю поміняти за допомогою style
зручно використовувати для створення або розширення адмін панелі.

```tsx
<CustomBtn 
        styles={{maxWidth: "200px", height:"100%"}} // Власні стили
        onClick={() =>createAndUpdateAccess()} // callBack при натисканні
        type={CustomBtnTypes.update} // Тип пресета
/>

/// Пресети ставлять текст у кнопку залежно від назви, якщо потрібно передати свій текст, потрібно обернути його компонентом

<CustomBtn> Потрібний текст </CustomBtn>
```

Так само кнопка має додаткові props:

- #### _**btnType**_ передає тип кнопки, з доступних є такі варіанти 'button' | 'submit' | 'reset'
###

### 🔹 customSelect - Власний Select, для зручного використання та власним стилем.

customSelect - компонент, який реалізує функціонал адаптивного Select, але зі своїм стилем.

```tsx
<CustomSelect 
        style={{fontSize:"1rem"}}  // власні стилі застосовуються до контейнера списку
        data={data ? data : []}  // масив string для відтворення вибору
        currentValue={customSelectState} // початкове і вибране значення, якщо не вказати, за замовчуванням буде "Choo the time"
        callback={(value)=>setCustomSelectState(value)} // callback який спрацьовує при виборі елемента зі списку
/>
```

###


### 🔹 AdminTable - Адаптивна таблиця для виведення та сортування даних.

AdminTable - компонент, який являє собою адаптивну таблицю,
повністю настроюється пошук і сортування даних, а так само має дуже великий функціонал

#### Приклад використання
```tsx
<div className={cl.tableContainer}>
  <AdminTable
          viewBtnOnClick={(id)=>setModalWindowActive({id, active: true})}
          deleteBtnOnClick={deleteRequest}
          checkSortIconActive={checkSortIconActive}
          onClickSortIconChange={checkSortIconChange}
          TableData={dataOfAdminTable}
          searchState={searchState}
          setSearchState={setSearchState}
          massiveOfRenderData={Roles ? Roles : []}
          searchParamsException={[]}
          firstBtnName={"Update"}
  />
</div>
```
Оскільки таблиця не має кольору заднього фону, а тільки грані стовпців, рядків і пошуку разом зі стилем кнопок, за допомогою будь-якого контейнера можна стилізувати цю таблицю.
Так само таблиця розтягується на всю ширину батька. для базового вигляду потрібно застосувати такі стилі:
```css
.tableContainer{
  width: 100%;
  max-height: 1000px;
  display: flex;
  padding: 1.25rem;
  table-layout: fixed;
  position: relative;
  flex-direction: column;
  overflow-y: auto;
  background-color: #FFFFFF;
  box-shadow: 0 0.46875rem 2.1875rem rgba(4, 9, 20, 0.03), 
  0 0.9375rem 1.40625rem rgba(4, 9, 20, 0.03), 0 0.25rem 0.53125rem rgba(4, 9, 20, 0.05), 
  0 0.125rem 0.1875rem rgba(4, 9, 20, 0.03);
  transition: all .2s;
  border: 1px solid rgba(26, 54, 126, 0.125);
  border-radius: .25rem;
}
```

**_P.S Сама по собі таблиця має завжди стовпчик, який знаходиться в кінці і займає 20% ширини з двома кнопками delete, і view за замовчуванням або ж має власний текст_****


### AdminTable props: 

- #### _**viewBtnOnClick**_ перша кнопка за замовчуванням із текстом view, пропс приймає значенням callback функцію, що має приймати параметр типу number, у цьому випадку це id запису, де було натиснуто кнопку.
- #### _**deleteBtnOnClick**_ так само приймає callback функцію де та, в свою чергу, приймає параметр типу number, що є id запису
- #### _**checkSortIconActive**_ це callback функція, яка приймає два параметри type, що має тип searchTypeEnum, і forward, що має тип searchForwardsEnum, функція має повертати логічне значення того, чи активна іконка сортування, тобто true/false, приклад реалізації цієї функції:
```tsx
function checkSortIconActive(type: searchTypeEnum, forward: searchForwardsEnum){
    return type === searchState.searchType && forward === searchState.searchForward
}
```
_**P.S searchState - це зовнішній стан, який містить поточне значення сортування (type що саме сортується, та forwards в який бік) значення searchType, та searchForward такого ж типу, як і параметри,**_

***
- #### _**onClickSortIconChange**_ така ж callback функція, яка приймає type і forwards, але змінює зовнішній стан searchState, для нового сортування
- #### _**TableData**_ Це константа, яка має свій власний формат для побудови таблиці, за нею таблиця автоматично вирішує, що сортувати як, і так далі. Основна структура всієї таблиці.
#### Приклад реалізації
```tsx
const dataOfAdminTable: AdminTableDataType = [
  {
    value: "#", /// Назви стовпця, в якому міститиметься наше значення з об'єкта 
    searchType: searchTypeEnum.id, /// naming поля за яким буде здійснюватися сортування 
    key: [searchTypeEnum.id], /// масив ключів, який містить naming полів для об'єднань і не тільки
    styles: {     // стилі для кожного зі стовпців, оскільки спочатку зайнято 20% останнім стовпчиком з кнопками, потрібно розподілити решту 80% 
      headers: {maxWidth: "40%", flex: "0 1 40%"}, /// верхні та нижні рядки таблиці
      data: {maxWidth: "40%", flex: "0 1 40%"}, // ряди з даними 
    },
  },
  {
    value: "Name of services",
    searchType: searchTypeEnum.service,
    key: [searchTypeEnum.service],
    styles: {
      headers: {maxWidth: "40%", flex: "0 1 40%"},
      data: {maxWidth: "40%", flex: "0 1 40%"},
    },
  },
]
```

#### Для полів об'єктів які містять у собі ще один об'єкт, наприклад
```tsx
const doctor = {
    first_name: "John",
    last_name: "Stathem",
    patient: {
        first_name: "John",
        last_name: "Stathem",
    }
}
```
Тоді потрібно вказати searchType так, як називається об'єкт, а key потрібно вказати всі поля, які будуть об'єднані.
<br/> Тобто вийде так: searchType: searchTypeEnum.patient, key: ["first_name", "last_name"]. Тоді пошук і відображення будуть працювати правильно

_**P.S якщо потрібно просто об'єднати поля одного об'єкта, припустимо, у нас є doctor, у якого є first_name і last_name <br/>
щоб їх не виносити в різні стовпці, їх можна об'єднати, як і в минулому прикладі, але searchType має бути таким самим, як і один із ключів. на прикладі константи doctor вище вийде так: searchTypeEnum.first_name, key: ["first_name", "last_name"]**_

Так само об'єднувати можна різні типи , number + string , number + boolean, і так далі.


***

- #### _**searchState**_  Принимает в себя то самое состояние searchState такого формата 
```tsx
export interface searchObjectsInterface{
    searchType: searchTypeEnum, // яке поле сортуємо
    searchForward: searchForwardsEnum, /// ascending / descending 
    limit: number, // limit об'єктів 
    page: number, // не використовується в AdminTable але потрібен для запитів RTK Query  
}
```
_**P.S Т.К в таблиці є select з вибором кількості елементів, що відображаються, limit зберігатиме число або оновлюватиме його після чого буде запит RTK query,**_
***

- #### _**setSearchState**_ Фукцнія стану для зміни limit,яка спрацьовує під час вибору кількості відображуваних об'єктів
- #### _**massiveOfRenderData**_ Якраз об'єкт для відображення його в таблиці, за правилами які ми задали в _dataOfAdminTable_
- #### _**searchParamsException**_ Туди передаємо масив searchTypeEnum значень, які не будуть використовуватися під час пошуку, і грають роль винятку.
- #### _**firstBtnName**_ Якщо потрібно Змінити назву першої кнопки, з дефолтного на власну.
- #### _**unitedKeyForSorting**_ Параметр приймає масив рядків, так як і key (повинен містити naming полів), є необов'язковим і впливатимуть на те, що зазначені тут ключі будуть об'єднані під час сортування, тобто якщо потрібно, щоб сортування відбувалось і на ім'я, і на прізвище, потрібно вказати як ключі first_name і last_name.
- #### _**additionalFunctionForSorting**_ Функція, яка буде першою використовуватися при сортуванні записів. Вона доповнює базовий алгоритм сортування або ж замінює його повністю, якщо це буде потрібно. Є необов'язковим параметром і потрібна для того, щоб сортувати за своїми правилами, тому-що таблиця сама по собі сортує тільки string, number, і date
_**Щоб сортувати власні дати, певні значення або щось інше за своїми правилами, потрібно створити цю функцію, яка працює наступним чином. Дана функція приймає a і b, тобто перший і другий об'єкт, і повинна повертати їхнє обчислення.
<br/> Ця функція виконуватиметься першою в алгоритмі, і якщо вона нічого не поверне (наприклад, якщо всередині не спрацюють умови), то продовжиться базовий алгоритм сортування за string, number або date.**_

### Приклад виконання:
```tsx
function additionalFunctionSorting(a:any, b:any){
    const customSortOneCheck = /^(0?[0-9]|1[0-2]):(00|15|30|45)$/  // time format 9:30
    const customSortTwoCheck =  /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/ // data format 30-01-2025
    if(customSortOneCheck.test(a)){ 
        const aStr = (a as string).split(":")
        const bStr = (b as string).split(":")
        if (Number(aStr[0]) !== Number(bStr[0])) {
            return Number(aStr[0]) - Number(bStr[0]);
         }else {
            return Number(aStr[1]) - Number(bStr[1]);
        }
  }else if(customSortTwoCheck.test(a)){
      const [aDay, aMonth, aYear] = a.split("-").map(Number);
      const [bDay, bMonth, bYear] = b.split("-").map(Number);
      const aDate = new Date(aYear, aMonth - 1, aDay);
      const bDate = new Date(bYear, bMonth - 1, bDay);
      // @ts-ignore
      return aDate - bDate;
  }else if(typeof a === "boolean"){
      //@ts-ignore
    return b - a
  }
  return null
}
```
Як ми бачимо, у нас відбувається сортування за власним форматом тобто 9:30, і датою 30-01-2025, а також за boolean значенням.
У нас є три перевірки за допомогою функіональних виразів, на те, чи підходять нам значення, які прийшли в a і b для нашого кастомного сортування.
це потрібно для того, щоб сортували тільки потрібні нам поля, а ті, які ми хочемо, щоб сортувалися за базовим алгоритмом, ми не включаємо в умови і повертаємо null, тоді таблиця буде їх сама сортувати

**_P.S потрібно повернути тільки a - b таблиця сама застосує цю фукнцію в дві сторони, ascending / descending_****
***



### 🔹PaginationBar - Custom pagination bar

PaginationBar - компонент, який бажано використовувати разом з AdminTable, являє собою бар з кнопками previous page, next, і номерами сторінок
так само як і AdminTable не має свого back-ground, і потрібно створювати свої стилі або використовувати стандартний.

### Приклад використання, і стандартні стилі:

```css
.paginationPanelContainer{
    display: flex;
    margin-right: -15px;
    margin-left: -15px;
    position: relative;
}

.statusInfoContainer{
    padding-left: 15px;
    padding-right: 15px;
    width: 100%;
    position: relative;
    flex: 1 1 35%;
}

.paginationButtonsContainer{
    padding-left: 15px;
    padding-right: 15px;
    width: 100%;
    position: relative;
    flex: 1 1 65%;
}

.statusInfoText{
    padding-top: 0.85rem;
    white-space: nowrap;
    font-size: .88rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    text-align: left;
}
```





```tsx
<div className={cl.paginationPanelContainer} >
    <div className={cl.statusInfoContainer}>                  // необов'язково, йде разом зі стадартними стилями і показує поточні елементи
      <div className={cl.statusInfoText}> 
          {`Showing ${searchState && (searchState.limit * (searchState.page - 1)) + 1} 
          to ${searchState?.limit * searchState.page} of ${Amount || 0} entries`}
        </div>
    </div> 
    <PaginationBar /// наш Елемент 
          previousPageFunc={() => {             // callback кнопки previos page
            setSearchState({...searchState!, page: searchState!.page - 1})
          }}
          setPageFunc={(page: number) => {    // callback який спрацьовує при натисканні на одну зі сторінок (кнопка з цифрою)
            if (searchState) {
              setSearchState({...searchState, page: page})
            }
          }}
          nextPageFunc={() => {   // callback кнопки next page
            setSearchState({...searchState!, page: searchState!.page + 1})
          }}
          currentPage={searchState && searchState.page || 1} // поточна сторінка для підсвічування кнопки 
          amount={Amount && Amount || 1} // кількість усіх елементів для розрахунку кількості кнопок
          limit={searchState && searchState.limit || 1} // ліміт елементів на сторінку і так само для розрахунку кнопки
          style={{justifyContent: "end"}} // додаткові стилі за необхідності
    />
</div>
```
- #### _**previousPageFunc**_ Callback який виконується при натисканні на кнопку previous page
- #### _**setPageFunc**_ Callback який приймає значення натиснутої сторінки при її натисканні.
- #### _**nextPageFunc**_ Callback який виконується при натисканні на кнопку next page
- #### _**currentPage**_ Для підсвічування сторінки, на якій ми зараз перебуваємо, а також для того, щоб previous і next не спрацьовували зайвий раз.
- #### _**amount**_ Загальна кількість Елементів для розрахунку кількість сторінок з урахуванням limit
- #### _**limit**_ Ліміт елементів на сторінку
- #### _**style**_ Додаткові стилі



#



## 🔧📍 Admin panel Routing

#### AdminPanel - компонент, який являє собою єдину сторінку з Admin компонентами з управління даними сервера, і сайту в цілому. Крім цього має автоматичну і повністю адаптивну під кількість обробку додавання нових розділів і контенту для Admin середовища.
**_P.S всі типи і константа для зміни знаходяться types/adminPanel.ts_****

###

### 🔹 Types
```tsx
export enum mainSections{ 
  doctor ="doctor",
  //...other
}

export enum underSection{ 
  actions ="Actions",
  //...other
}


export enum chosenAttribute{ 
  management="management",
  access="access",
  //...other
}
```
- #### _**mainSections**_ головна секція, яка є заголовком всієї секції, водночас є змістом і заголовком секції, а також їм присвоюється відповідна іконка
- #### _**underSection**_ під секція, таких в mainSections може бути безмежна кількість, вони в себе так само включають необмежену кількість атрибутів. При натисканні приховує або розкриває список атрибутів
- #### _**chosenAttribute**_ атрибут при натисканні на який відмальовує присвоєний ему Admin елемент.

_**Перед тим, як додавати нову секцію до бічної панелі AdminPanel, потрібно додати або використати готові типи naming, для секцій атрибутів і під секцій**_.

###

### 🔹 Using

Основою всієї бічної панелі є дана константа, яка знаходиться types/adminPanelType.ts <br/>
Сама константа складається з об'єктів типу sideBarAdminPanelElementsInterFace, де кожен об'єкт являє собою новий розділ
```tsx 
///  Об'єкт  типа sideBarAdminPanelElementsInterFace
{
    svgIconPath: "RoleIcon", /// id іконки, що міститься в sprite.svg, іконка буде поруч із заголовком
    mainSection: mainSections.roles,  // naming заголовка секції 
    underSections: [ // Масив об'єктів під секцій 
        { // перша под секція
          name: underSection.actions,  // naming під секції 
          attributes: [  // Масив атрибутів, які будуть відображатися як аркуш цієї секції
            { /// перший атрибут
              attribute: chosenAttribute.management, // naming атрибута
              element: RolesManagementSection  // елемент, який відображатиметься при натисканні на атрибут
            },
            {  /// другий атрибут
              attribute: chosenAttribute.access,  // naming атрибута
              element: RoleAccessSection // елемент, який відображатиметься при натисканні на атрибут
            },
            //..other
          ],
        },
  //..other
    ],
},
```


#### Приклад використання: 
```tsx
export const sideBarAdminPanelElements: sideBarAdminPanelElementsInterFace[] = [
  {
    svgIconPath: "DoctorIcon",
    mainSection: mainSections.doctor,
    underSections: [
      {
        name: underSection.actions,
        attributes: [
          {
            attribute: chosenAttribute.management,
            element: DoctorManagementSection
          }
          //..other
        ],
      },
      //..other
    ],
  },
  {
    svgIconPath: "RoleIcon",
    mainSection: mainSections.roles,
    underSections: [
      {
        name: underSection.actions,
        attributes: [
          {
            attribute: chosenAttribute.management,
            element: RolesManagementSection
          },
          {
            attribute: chosenAttribute.access,
            element: RoleAccessSection
          },
                //..other
        ],
      },
      //..other
    ],
  },
  //..other
];
```
#### P.S. Назви підсекцій та атрибутів можуть збігатися в різних секціях, але не можуть збігатися, якщо знаходяться в одній секції.<br/> Якщо подивитися в секціях Doctor і Roles, в одній із підсекцій назва атрибута збігається – це нормально. </br> Також допустимий випадок, коли назви атрибутів у різних підсекціях однієї головної секції збігаються.

###

### 🔹 Current Side Bar Tree
```bash
Current Tree: 
│── doctor                             # mainSection
│   └── action                         # under section 
│       └── management                 # attribute / management реалізує CRUD, до таблиці зазначеної в mainSection
│── patient                           
│   └── action                   
│       └── management         
│── news                             
│   └── action                   
│       └── management            
│── diagnoses
│   └── action                   
│       └── management            
│── services
│   └── action                   
│       └── management    
│── speciality
│   └── action                   
│       └── management    
│── appointments
│   └── action                   
│       └── management   
│── rating
│   └── action                   
│       └── management   
└── roles
    └── action   
        │── management                 
        └── access                     # attribute  / access предоставляет систему управления доступа ролей                                        
```
Так чином ми бачимо, як розташовані елементи на бічній панелі. under секції можуть закриватися, тим самим реалізуючи список,
так само кожен атрибут має свій комопнент, який відмальовує,
і варто нагадати, що єдине, що потрібно зробити, щоб додати новий функціонал у бічну панель, - це додати об'єкт у головну константу.  Далі все обробиться і додасться автоматично. <br/>

**_P.S Обмежень за кількістю секцій, під секцій, атрибутів немає._**

#


# ❌ Error Handler

### У всьому додатку використовується ErrorSlice (redux toolkit), що міститься в store/reducers/ErrorSlice.ts <br/> для виведення помилки або навпаки успішної дії на екран користувачеві.

## Приклад реалізації: 

```tsx
try {
    const response = await appointmentDelete(Number(id))
    if(response?.error){
        throw new Error("Deleting error") // кадаємо повідомлення про помилку
    }else{  // якщо помилки немає, і запит пройшов успішно
        dispatch(errorSlice.actions.setErrors({message:"Delete has been successful", type: messageType.successType})) // додаємо в Error slice повідомлення про успішне виконання
    }
}catch (e){ // ловимо повідомлення про помилку
  dispatch(errorSlice.actions.setErrors({message: typeof e === "string" ? e : "Error", type: messageType.errorType}))  // додаємо в Error slice повідомлення про помилку
}
```

### Тут у нас два випадки, коли запит відбувся успішно і коли ні, в одному випадку ми передаємо messageType.successType, в іншому messageType.errorType, повідомлення про помилку може бути будь-яке у форматі тексту

### Далі залежно від типу (error/success) справа по середині з'являється повідомлення з відповідним кольором повідомлення, після чого зникає

### _P.S Кількість помилок за раз необмежена, вони будуть складатися одна на одну, з невеликою затримкою, їхній час життя 2 с після чого вони зникають по черзі FIFO_




#








### last update of documentation -  16.02.2025