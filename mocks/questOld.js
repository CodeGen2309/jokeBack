const questions = [
  "Что будет делать кошка, если облить собаку валерьянкой?",
  "Как может звучать худший слоган для зубной пасты?",
  "Как назвать самца божьей коровки?",
  "Почему бублики готовят с дырками?",
  "Какой эксперимент вы бы провели, если были бы сумасшедшим ученым?",
  "Как звали бы Красную Шапочку без ее головного убора?",
  "Что легче понять — женщин или почему круглую пиццу ставят в квадратную коробку?",
  "Говорят «Вырастешь, поймешь». Кто что понял, когда вырос?",
  "Если на концерт исполнителя пришло мало людей, можно ли назвать его малосольным?",
  "Где край света?",
  "Думали ли вы, что кошка, которая просит открыть дверь, хочет чтобы ушли вы?",
  "Если в жизни так много интересного, почему так мало тех, кто интересуется?",
  "Как могла бы называться ваша автобиография?",
  "Кого считают овцы, чтобы уснуть?",
  "Почему врачи свою деятельность называют практикой?",
  "Когда крысе бежать с корабля, если она его капитан?",
  "Почему при разводе спрашивают о его причине, а при вступлении в брак — нет.",
  "Чем обычный человек отличается от нормального?",
  "Что бы вы сказали инопланетянам, высадись они на Землю?",
  "Считается ли бездомной черепаха без панциря?",
  "Почему в сказке о репке только у собаки есть имя?",
  "Почему говорят «устал как собака», если собаки не работают?",
  "Почему девушку в браке можно называть «мужнина жена», а на парня не говорят «женский муж»?",
  "Что мешает плохим танцовщицам?",
  "Нужно ли девушке дьявольское терпение, чтобы сохранить ангельский характер?",
  "Как вы думаете, кашу в голове можно считать пищей для ума?",
  "Чего никогда нет в женской сумочке?",
  "Почему девушки открывают рот, когда красят ресницы?",
  "Как точно определить свой возраст, если внезапно забыла его?",
  "Что выбрать — быть красивой или умной?",
  "Для чего придумали свет в холодильнике, если ночью кушать нельзя?",
  "Почему девушки называют себя кошечками?",
  "О чем девушки мечтают чаще — о маленьком черном или большом белом платье?",
  "Если есть хозяйки домашние, есть ли дикие?",
  "Какая моль не мечтает, чтоб ее вызвали на ковер?",
  "За что комары кусаются?",
  "Куда складывать свернутые горы?",
  "Как от 1 кг конфет женщина поправляется на 5 кг?",
  "На чьей одежде в семье можно сэкономить?",
  "Как может называться сериал о твоей жизни?",
  "Почему женщины не ездят смотреть сериалы в Мексику?",
  "Есть скорости звука и света. Почему нет скорости запаха?",
  "Можно ли называть лестницей сломанный эскалатор?",
  "Если бы вы дали имя своему автомобилю, каким бы оно было?",
  "Кто выбрасывает из бара пьяного охранника?",
  "Какую супергероиню взял бы в жены?",
  "Почему влюбленные парни слепнут, а женатые — глохнут?",
  "Если не сейчас, то когда?",
  "Можно назвать хлопья с молоком супом?",
  "Зачем Бог создал женщину?",
  "Нужен ли поварской колпак лысому?",
  "В каких лесах нет дичи?",
  "Какой рукой лучше размешать чай?",
  "Может ли пингвин назвать себя птицей?",
  "По какому пути еще никто не ходил?",
  "Кто получает много вопросов, не задавая их?",
  "Первая женщина, освоившая летательный аппарат?",
  "Как жвачка перешла дорогу?",
  "Как назвать снеговика летом?",
  "Почему призраки не могут лгать?",
  "На каком море отдыхают зомби?",
  "Какого цвета смущенный хамелеон?",
  "Какое ваше идеальное утро?",
  "«Камень – ножницы — бумага» — эффективное решение спорных вопросов?",
  "Какую сверхспособность вы бы выбрали для себя?",
  "Как бы вы решили проблемы, находясь на Марсе?",
  "На машине времени вы отправились бы в прошлое или будущее?",
  "На что бы вы потратили все деньги?",
  "Какой свой талант вы назвали бы самым странным?",
  "В каких цветах был бы выполнен ваш автопортрет?",
  "Кто был вашим кумиром?",
  "Какую песню вы обязательно бы спели в караоке?",
  "Если бы вам выпал шанс выступить на передаче American Idol, то какую бы песню вы спели?",
  "Если бы вы были коробкой хлопьев, что это были бы за хлопья и почему?",
  "Почему мячик для тенниса ворсистый?",
  "Верите ли вы в снежного человека?",
  "Можете ли рассказать как сделать бумажный самолетик, но только на словах, не показывая.",
  "Как работает интернет?",
  "Какого цвета деньги?",
  "Какой последний подарок вы дарили и кому?",
  "Представьте, что вам 80 лет. Что бы вы рассказали внукам о своей жизни?",
  "Вы честный человек? Насколько?",
  "Если бы мы жили в зоопарке, какими мы были бы животными?",
  "Какую суперсилу ты бы хотел приобрести?",
  "Если бы тебе пришлось всю неделю кушать еду одного цвета, какой это был бы цвет?",
  "Почему люди читают книги?",
  "Как бы ты назвал мультфильм с собой в главной роли?",
  "Что бы сказали твои мягкие игрушки, если бы умели говорить?",
  "Где живут сны?",
  "Кто самый добрый человек на планете и почему?",
  "В каком случае даже в пустом кармане что-нибудь бывает?",
  "Воробей может съесть горстку зерна, а лошадь — нет. Почему?",
  "Что такое же огромное как слон, но ничего не весит?",
  "В каком месяце 28 дней?",
  "Что находится между дверью и окном?",
  "Что за растение вырастает из двух нот?",
  "За чем мы едим?",
  "Этим заканчивается каждый день и ночь.",
  "Кто не сможет намочить волосы под дождем?",
  "Каких камней не найдешь в море?",
  "На каких полях ничего не может расти?",
  "Как сломать ветку, не спугнув птицу?",
  "Какой болезнью не болеют на суше?"
]


export default questions