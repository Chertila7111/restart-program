import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' }}
              >
                R
              </div>
              <span className="font-bold text-white text-lg">Restart</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Программа восстановления и нового старта после расставания. Психолог, группа поддержки и практический план.
            </p>
          </div>

          {/* Программа */}
          <div>
            <h4 className="font-semibold text-white mb-4">Программа</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/program" className="hover:text-violet-400 transition-colors">О программе</Link></li>
              <li><Link href="/pricing" className="hover:text-violet-400 transition-colors">Тарифы</Link></li>
              <li><Link href="/reviews" className="hover:text-violet-400 transition-colors">Отзывы</Link></li>
              <li><Link href="/faq" className="hover:text-violet-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Полезное */}
          <div>
            <h4 className="font-semibold text-white mb-4">Полезное</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-violet-400 transition-colors">Блог</Link></li>
              <li><Link href="/blog/kak-perezhit-rasstoanie-7-shagov" className="hover:text-violet-400 transition-colors">Как пережить расставание</Link></li>
              <li><Link href="/blog/kak-zabyt-byvshego-rukovodstvo" className="hover:text-violet-400 transition-colors">Как забыть бывшего</Link></li>
              <li><Link href="/contacts" className="hover:text-violet-400 transition-colors">Контакты</Link></li>
            </ul>
          </div>

          {/* Юридическое */}
          <div>
            <h4 className="font-semibold text-white mb-4">Документы</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal/privacy" className="hover:text-violet-400 transition-colors">Политика конфиденциальности</Link></li>
              <li><Link href="/legal/terms" className="hover:text-violet-400 transition-colors">Пользовательское соглашение</Link></li>
              <li><Link href="/legal/offer" className="hover:text-violet-400 transition-colors">Публичная оферта</Link></li>
            </ul>

            <div className="mt-6">
              <p className="text-xs text-gray-500">ИП Иванов И.И.</p>
              <p className="text-xs text-gray-500">ОГРНИП: 000000000000000</p>
              <p className="text-xs text-gray-500 mt-2">
                <a href="mailto:hello@restart-program.ru" className="hover:text-violet-400 transition-colors">
                  hello@restart-program.ru
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} Restart. Все права защищены.
          </p>
          <p className="text-xs text-gray-600 text-center max-w-md">
            Программа не является медицинской услугой. Результаты индивидуальны и зависят от активности участника.
          </p>
        </div>
      </div>
    </footer>
  )
}
