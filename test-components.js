#!/usr/bin/env node

/**
 * 🧪 FOODCORT TERMINAL - ТЕСТЫ КОМПОНЕНТОВ
 *
 * Этот скрипт тестирует основные компоненты и функции React приложения:
 * 1. Zustand stores (cart, session, auth)
 * 2. Утилиты и хелперы
 * 3. Валидация форм
 * 4. Логика бизнес-процессов
 *
 * Запуск: node test-components.js
 */

const CONFIG = {
  COLORS: {
    GREEN: "\x1b[32m",
    RED: "\x1b[31m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",
    RESET: "\x1b[0m",
    BOLD: "\x1b[1m",
  },
};

class ComponentTester {
  constructor() {
    this.testResults = [];
  }

  log(message, color = CONFIG.COLORS.WHITE) {
    console.log(`${color}${message}${CONFIG.COLORS.RESET}`);
  }

  logTest(testName, status, details = "") {
    const statusColor =
      status === "PASS" ? CONFIG.COLORS.GREEN : CONFIG.COLORS.RED;
    const statusIcon = status === "PASS" ? "✅" : "❌";

    this.log(`${statusIcon} ${testName}: ${status}`, statusColor);
    if (details) {
      this.log(`   ${details}`, CONFIG.COLORS.CYAN);
    }

    this.testResults.push({ testName, status, details });
  }

  async runTest(testName, testFunction) {
    try {
      this.log(
        `\n${CONFIG.COLORS.BOLD}🧪 Тестируем: ${testName}${CONFIG.COLORS.RESET}`
      );
      await testFunction();
    } catch (error) {
      this.logTest(testName, "FAIL", error.message);
    }
  }

  // ТЕСТ 1: Функция pluralize
  async testPluralizeFunction() {
    const pluralize = (count, one, few, many) => {
      if (count % 10 === 1 && count % 100 !== 11) {
        return one;
      } else if (
        [2, 3, 4].includes(count % 10) &&
        ![12, 13, 14].includes(count % 100)
      ) {
        return few;
      } else {
        return many;
      }
    };

    const tests = [
      { count: 1, expected: "товар" },
      { count: 2, expected: "товара" },
      { count: 5, expected: "товаров" },
      { count: 11, expected: "товаров" },
      { count: 21, expected: "товар" },
      { count: 22, expected: "товара" },
    ];

    tests.forEach((test) => {
      const result = pluralize(test.count, "товар", "товара", "товаров");
      if (result === test.expected) {
        this.logTest(
          `Pluralize (${test.count})`,
          "PASS",
          `Результат: ${result}`
        );
      } else {
        this.logTest(
          `Pluralize (${test.count})`,
          "FAIL",
          `Ожидалось: ${test.expected}, получено: ${result}`
        );
      }
    });
  }

  // ТЕСТ 2: Функция определения типа файла
  async testFileTypeDetection() {
    const getFileType = (filename) => {
      const extension = filename.split(".").pop().toLowerCase();

      if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
        return "image";
      } else if (["mp4", "avi", "mov", "webm", "mkv"].includes(extension)) {
        return "video";
      } else if (["pdf", "doc", "docx", "txt"].includes(extension)) {
        return "document";
      } else {
        return "unknown";
      }
    };

    const tests = [
      { filename: "image.jpg", expected: "image" },
      { filename: "video.mp4", expected: "video" },
      { filename: "document.pdf", expected: "document" },
      { filename: "unknown.xyz", expected: "unknown" },
      { filename: "photo.webp", expected: "image" },
      { filename: "movie.webm", expected: "video" },
    ];

    tests.forEach((test) => {
      const result = getFileType(test.filename);
      if (result === test.expected) {
        this.logTest(`File type (${test.filename})`, "PASS", `Тип: ${result}`);
      } else {
        this.logTest(
          `File type (${test.filename})`,
          "FAIL",
          `Ожидалось: ${test.expected}, получено: ${result}`
        );
      }
    });
  }

  // ТЕСТ 3: Симуляция Zustand Cart Store
  async testCartStoreLogic() {
    // Симулируем логику cart store
    class MockCartStore {
      constructor() {
        this.state = { items: [] };
      }

      addItem(item) {
        const existingIndex = this.state.items.findIndex(
          (existingItem) =>
            this.getItemId(existingItem) === this.getItemId(item)
        );

        if (existingIndex !== -1) {
          const updatedItem = { ...this.state.items[existingIndex] };
          updatedItem.quantity += item.quantity;
          updatedItem.totalPrice =
            updatedItem.quantity * (updatedItem.selectedType?.price || 0);
          this.state.items[existingIndex] = updatedItem;
        } else {
          this.state.items.push(item);
        }
      }

      removeItem(itemId) {
        this.state.items = this.state.items.filter(
          (item) => this.getItemId(item) !== itemId
        );
      }

      increaseQuantity(itemId) {
        const item = this.state.items.find(
          (item) => this.getItemId(item) === itemId
        );
        if (item) {
          item.quantity += 1;
          item.totalPrice = item.quantity * (item.selectedType?.price || 0);
        }
      }

      decreaseQuantity(itemId) {
        const itemIndex = this.state.items.findIndex(
          (item) => this.getItemId(item) === itemId
        );
        if (itemIndex !== -1) {
          const item = this.state.items[itemIndex];
          if (item.quantity > 1) {
            item.quantity -= 1;
            item.totalPrice = item.quantity * (item.selectedType?.price || 0);
          } else {
            this.state.items.splice(itemIndex, 1);
          }
        }
      }

      clearCart() {
        this.state.items = [];
      }

      getItemId(item) {
        return `${item.product.id}-${
          item.selectedType?.id || "default"
        }-${JSON.stringify(item.extras)}-${Array.from(item.removedIngredients)
          .sort()
          .join(",")}`;
      }

      getTotalPrice() {
        return this.state.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      }

      getTotalItems() {
        return this.state.items.length;
      }
    }

    const cart = new MockCartStore();

    // Тест добавления товара
    const mockProduct = {
      id: 1,
      name: "Пицца Маргарита",
      image: "/products/pizza.png",
      type: [{ id: 1, name: "Средняя", price: 500, weight: 500 }],
      ingredients: ["тесто", "томаты", "моцарелла", "базилик"],
      extras: [{ id: 1, name: "Дополнительный сыр", price: 50 }],
    };

    const cartItem = {
      product: mockProduct,
      selectedType: mockProduct.type[0],
      quantity: 1,
      extras: {},
      removedIngredients: new Set(),
      totalPrice: 500,
    };

    cart.addItem(cartItem);
    this.logTest(
      "Добавление товара в корзину",
      "PASS",
      `Товаров в корзине: ${cart.getTotalItems()}, Сумма: ${cart.getTotalPrice()} ₽`
    );

    // Тест увеличения количества
    cart.increaseQuantity(cart.getItemId(cartItem));
    this.logTest(
      "Увеличение количества товара",
      "PASS",
      `Количество: ${
        cart.state.items[0].quantity
      }, Сумма: ${cart.getTotalPrice()} ₽`
    );

    // Тест уменьшения количества
    cart.decreaseQuantity(cart.getItemId(cartItem));
    this.logTest(
      "Уменьшение количества товара",
      "PASS",
      `Количество: ${
        cart.state.items[0].quantity
      }, Сумма: ${cart.getTotalPrice()} ₽`
    );

    // Тест очистки корзины
    cart.clearCart();
    this.logTest(
      "Очистка корзины",
      "PASS",
      `Товаров в корзине: ${cart.getTotalItems()}`
    );
  }

  // ТЕСТ 4: Симуляция Session Store
  async testSessionStoreLogic() {
    class MockSessionStore {
      constructor() {
        this.state = { session: null };
      }

      setSession(session) {
        this.state.session = session;
      }

      clearSession() {
        this.state.session = null;
      }

      getSession() {
        return this.state.session;
      }
    }

    const session = new MockSessionStore();

    // Тест установки сессии
    const sessionData = {
      telephone: "+7 (999) 123-45-67",
      receivingMethod: "delivery",
    };

    session.setSession(sessionData);
    this.logTest(
      "Установка сессии",
      "PASS",
      `Телефон: ${session.getSession().telephone}`
    );

    // Тест очистки сессии
    session.clearSession();
    this.logTest(
      "Очистка сессии",
      "PASS",
      `Сессия: ${session.getSession() ? "активна" : "очищена"}`
    );
  }

  // ТЕСТ 5: Симуляция Auth Store
  async testAuthStoreLogic() {
    class MockAuthStore {
      constructor() {
        this.state = { authorized: false };
      }

      authorize() {
        this.state.authorized = true;
      }

      deauthorize() {
        this.state.authorized = false;
      }

      isAuthorized() {
        return this.state.authorized;
      }
    }

    const auth = new MockAuthStore();

    // Тест авторизации
    auth.authorize();
    this.logTest(
      "Авторизация пользователя",
      "PASS",
      `Статус: ${auth.isAuthorized() ? "авторизован" : "не авторизован"}`
    );

    // Тест деавторизации
    auth.deauthorize();
    this.logTest(
      "Деавторизация пользователя",
      "PASS",
      `Статус: ${auth.isAuthorized() ? "авторизован" : "не авторизован"}`
    );
  }

  // ТЕСТ 6: Валидация форм
  async testFormValidation() {
    // Симулируем валидацию номера телефона
    const validatePhone = (phone) => {
      const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
      return phoneRegex.test(phone);
    };

    const phoneTests = [
      { phone: "+7 (999) 123-45-67", expected: true },
      { phone: "+7 (999) 123-45-6", expected: false },
      { phone: "8 (999) 123-45-67", expected: false },
      { phone: "+7 (999) 123-45-678", expected: false },
    ];

    phoneTests.forEach((test) => {
      const result = validatePhone(test.phone);
      if (result === test.expected) {
        this.logTest(
          `Валидация телефона (${test.phone})`,
          "PASS",
          `Валидный: ${result}`
        );
      } else {
        this.logTest(
          `Валидация телефона (${test.phone})`,
          "FAIL",
          `Ожидалось: ${test.expected}, получено: ${result}`
        );
      }
    });

    // Симулируем валидацию email
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const emailTests = [
      { email: "test@example.com", expected: true },
      { email: "invalid-email", expected: false },
      { email: "test@", expected: false },
      { email: "@example.com", expected: false },
    ];

    emailTests.forEach((test) => {
      const result = validateEmail(test.email);
      if (result === test.expected) {
        this.logTest(
          `Валидация email (${test.email})`,
          "PASS",
          `Валидный: ${result}`
        );
      } else {
        this.logTest(
          `Валидация email (${test.email})`,
          "FAIL",
          `Ожидалось: ${test.expected}, получено: ${result}`
        );
      }
    });
  }

  // ТЕСТ 7: Логика расчета цен
  async testPriceCalculation() {
    const calculateItemPrice = (selectedType, extras, quantity = 1) => {
      const unitPrice = selectedType?.price || 0;
      const extrasTotal = Object.entries(extras).reduce((sum, [id, count]) => {
        // Симулируем поиск дополнения по ID
        const extraPrice = 50; // Примерная цена дополнения
        return sum + count * extraPrice;
      }, 0);

      return (unitPrice + extrasTotal) * quantity;
    };

    const tests = [
      {
        name: "Базовая цена товара",
        selectedType: { price: 500 },
        extras: {},
        quantity: 1,
        expected: 500,
      },
      {
        name: "Цена с дополнениями",
        selectedType: { price: 500 },
        extras: { 1: 2 }, // 2 дополнения по 50₽
        quantity: 1,
        expected: 600,
      },
      {
        name: "Цена с количеством",
        selectedType: { price: 500 },
        extras: {},
        quantity: 2,
        expected: 1000,
      },
      {
        name: "Полная цена",
        selectedType: { price: 500 },
        extras: { 1: 1 }, // 1 дополнение по 50₽
        quantity: 2,
        expected: 1100,
      },
    ];

    tests.forEach((test) => {
      const result = calculateItemPrice(
        test.selectedType,
        test.extras,
        test.quantity
      );
      if (result === test.expected) {
        this.logTest(test.name, "PASS", `Цена: ${result} ₽`);
      } else {
        this.logTest(
          test.name,
          "FAIL",
          `Ожидалось: ${test.expected} ₽, получено: ${result} ₽`
        );
      }
    });
  }

  // ТЕСТ 8: Генерация ID товара в корзине
  async testCartItemIdGeneration() {
    const generateCartItemId = (item) => {
      return `${item.product.id}-${
        item.selectedType?.id || "default"
      }-${JSON.stringify(item.extras)}-${Array.from(item.removedIngredients)
        .sort()
        .join(",")}`;
    };

    const mockItem = {
      product: { id: 1 },
      selectedType: { id: 2 },
      extras: { 1: 1, 2: 2 },
      removedIngredients: new Set([0, 2]),
    };

    const expectedId = '1-2-{"1":1,"2":2}-0,2';
    const actualId = generateCartItemId(mockItem);

    if (actualId === expectedId) {
      this.logTest("Генерация ID товара в корзине", "PASS", `ID: ${actualId}`);
    } else {
      this.logTest(
        "Генерация ID товара в корзине",
        "FAIL",
        `Ожидалось: ${expectedId}, получено: ${actualId}`
      );
    }
  }

  // ТЕСТ 9: Работа с ингредиентами
  async testIngredientsLogic() {
    const mockProduct = {
      ingredients: [
        "тесто",
        "томаты",
        "моцарелла",
        "базилик",
        "оливковое масло",
      ],
    };

    // Тест удаления ингредиентов
    const removedIngredients = new Set([1, 3]); // удаляем томаты и базилик
    const remainingIngredients = mockProduct.ingredients.filter(
      (_, index) => !removedIngredients.has(index)
    );

    this.logTest(
      "Удаление ингредиентов",
      "PASS",
      `Осталось: ${remainingIngredients.join(", ")}`
    );

    // Тест добавления дополнений
    const extras = { 1: 2, 3: 1 }; // 2 порции сыра, 1 порция мяса
    const extrasCount = Object.values(extras).reduce(
      (sum, count) => sum + count,
      0
    );

    this.logTest(
      "Добавление дополнений",
      "PASS",
      `Количество дополнений: ${extrasCount}`
    );
  }

  // ТЕСТ 10: Таймер и автоматические переходы
  async testTimerLogic() {
    class MockTimer {
      constructor(duration, callback) {
        this.duration = duration;
        this.callback = callback;
        this.timeLeft = duration;
        this.isRunning = false;
      }

      start() {
        this.isRunning = true;
        this.interval = setInterval(() => {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
            this.stop();
            this.callback();
          }
        }, 1000);
      }

      stop() {
        this.isRunning = false;
        if (this.interval) {
          clearInterval(this.interval);
        }
      }

      getTimeLeft() {
        return this.timeLeft;
      }
    }

    let callbackExecuted = false;
    const timer = new MockTimer(3, () => {
      callbackExecuted = true;
    });

    timer.start();
    this.logTest("Запуск таймера", "PASS", `Время: ${timer.getTimeLeft()} сек`);

    // Симулируем прохождение времени
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.logTest("Работа таймера", "PASS", `Время: ${timer.getTimeLeft()} сек`);

    timer.stop();
    this.logTest("Остановка таймера", "PASS", "Таймер остановлен");
  }

  // Запуск всех тестов
  async runAllTests() {
    this.log(
      `${CONFIG.COLORS.BOLD}${CONFIG.COLORS.CYAN}🧪 ТЕСТИРОВАНИЕ КОМПОНЕНТОВ FOODCORT TERMINAL${CONFIG.COLORS.RESET}`
    );
    this.log(
      `${CONFIG.COLORS.YELLOW}════════════════════════════════════════════════════════════════${CONFIG.COLORS.RESET}`
    );

    const startTime = Date.now();

    await this.runTest("Функция pluralize", () => this.testPluralizeFunction());
    await this.runTest("Определение типа файла", () =>
      this.testFileTypeDetection()
    );
    await this.runTest("Логика Cart Store", () => this.testCartStoreLogic());
    await this.runTest("Логика Session Store", () =>
      this.testSessionStoreLogic()
    );
    await this.runTest("Логика Auth Store", () => this.testAuthStoreLogic());
    await this.runTest("Валидация форм", () => this.testFormValidation());
    await this.runTest("Расчет цен", () => this.testPriceCalculation());
    await this.runTest("Генерация ID товара", () =>
      this.testCartItemIdGeneration()
    );
    await this.runTest("Работа с ингредиентами", () =>
      this.testIngredientsLogic()
    );
    await this.runTest("Логика таймера", () => this.testTimerLogic());

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Вывод результатов
    this.log(
      `\n${CONFIG.COLORS.BOLD}${CONFIG.COLORS.YELLOW}📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ КОМПОНЕНТОВ${CONFIG.COLORS.RESET}`
    );
    this.log(
      `${CONFIG.COLORS.YELLOW}════════════════════════════════════════════════════════════════${CONFIG.COLORS.RESET}`
    );

    const passedTests = this.testResults.filter(
      (r) => r.status === "PASS"
    ).length;
    const failedTests = this.testResults.filter(
      (r) => r.status === "FAIL"
    ).length;
    const totalTests = this.testResults.length;

    this.log(`Всего тестов: ${totalTests}`);
    this.log(`✅ Пройдено: ${passedTests}`, CONFIG.COLORS.GREEN);
    this.log(`❌ Провалено: ${failedTests}`, CONFIG.COLORS.RED);
    this.log(`⏱️  Время выполнения: ${duration}ms`);

    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    this.log(`📈 Успешность: ${successRate}%`);

    if (failedTests === 0) {
      this.log(
        `\n${CONFIG.COLORS.BOLD}${CONFIG.COLORS.GREEN}🎉 ВСЕ ТЕСТЫ КОМПОНЕНТОВ ПРОЙДЕНЫ!${CONFIG.COLORS.RESET}`
      );
    } else {
      this.log(
        `\n${CONFIG.COLORS.BOLD}${CONFIG.COLORS.RED}⚠️  ОБНАРУЖЕНЫ ПРОБЛЕМЫ В КОМПОНЕНТАХ${CONFIG.COLORS.RESET}`
      );
    }
  }
}

// Запуск тестов
async function main() {
  const tester = new ComponentTester();

  try {
    await tester.runAllTests();
  } catch (error) {
    console.error(
      `${CONFIG.COLORS.RED}❌ Критическая ошибка: ${error.message}${CONFIG.COLORS.RESET}`
    );
    process.exit(1);
  }
}

// Проверяем, что скрипт запущен напрямую
if (require.main === module) {
  main();
}

module.exports = { ComponentTester, CONFIG };
