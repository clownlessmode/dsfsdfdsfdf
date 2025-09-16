#!/bin/bash

# 🧪 FOODCORT TERMINAL - ЗАПУСК ВСЕХ ТЕСТОВ
# Этот скрипт запускает все тесты системы и выводит сводный отчет

echo "🚀 FOODCORT TERMINAL - КОМПЛЕКСНОЕ ТЕСТИРОВАНИЕ"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Функция для вывода заголовка
print_header() {
    echo -e "${BLUE}📋 $1${NC}"
    echo "────────────────────────────────────────────────────────────────"
}

# Функция для вывода результата
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2 - УСПЕШНО${NC}"
    else
        echo -e "${RED}❌ $2 - ОШИБКА${NC}"
    fi
}

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js не найден. Установите Node.js для запуска тестов.${NC}"
    exit 1
fi

echo -e "${CYAN}🔍 Проверка окружения...${NC}"
echo "Node.js версия: $(node --version)"
echo "NPM версия: $(npm --version)"
echo ""

# Запускаем тесты компонентов
print_header "ТЕСТИРОВАНИЕ КОМПОНЕНТОВ"
echo "Запуск тестов логики компонентов..."
echo ""

COMPONENTS_RESULT=0
if node test-components.js; then
    COMPONENTS_RESULT=0
else
    COMPONENTS_RESULT=1
fi

echo ""
print_result $COMPONENTS_RESULT "Тесты компонентов"

# Запускаем интеграционные тесты
print_header "ИНТЕГРАЦИОННЫЕ ТЕСТЫ"
echo "Запуск тестов API и интеграции..."
echo ""

INTEGRATION_RESULT=0
if node test-integration.js; then
    INTEGRATION_RESULT=0
else
    INTEGRATION_RESULT=1
fi

echo ""
print_result $INTEGRATION_RESULT "Интеграционные тесты"

# Сводный отчет
echo ""
print_header "СВОДНЫЙ ОТЧЕТ"
echo ""

TOTAL_TESTS=2
PASSED_TESTS=0

if [ $COMPONENTS_RESULT -eq 0 ]; then
    ((PASSED_TESTS++))
fi

if [ $INTEGRATION_RESULT -eq 0 ]; then
    ((PASSED_TESTS++))
fi

SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))

echo "Всего наборов тестов: $TOTAL_TESTS"
echo -e "✅ Пройдено: ${GREEN}$PASSED_TESTS${NC}"
echo -e "❌ Провалено: ${RED}$((TOTAL_TESTS - PASSED_TESTS))${NC}"
echo -e "📈 Успешность: ${CYAN}$SUCCESS_RATE%${NC}"

echo ""
if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    echo -e "${GREEN}🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!${NC}"
    echo -e "${GREEN}Система FOODCORT TERMINAL работает корректно!${NC}"
    EXIT_CODE=0
else
    echo -e "${RED}⚠️  ОБНАРУЖЕНЫ ПРОБЛЕМЫ${NC}"
    echo -e "${RED}Требуется исправление $((TOTAL_TESTS - PASSED_TESTS)) наборов тестов${NC}"
    EXIT_CODE=1
fi

echo ""
echo -e "${CYAN}💡 Полезные команды:${NC}"
echo "  npm run dev          - Запуск в режиме разработки"
echo "  npm run test         - Запуск интеграционных тестов"
echo "  npm run test:components - Запуск тестов компонентов"
echo "  npm run test:all     - Запуск всех тестов"
echo ""
echo -e "${CYAN}🌐 Приложение доступно по адресу: http://localhost:3000${NC}"

exit $EXIT_CODE
