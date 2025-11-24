export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre a IdeiaSpace</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Somos pioneiros em tecnologia espacial, dedicados a conectar o mundo através de soluções inovadoras de satélite.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Nossa Missão</h2>
              <p className="text-lg text-gray-600 mb-4">
                Levar conectividade de alta qualidade para todos os cantos do planeta, 
                eliminando a exclusão digital e promovendo o acesso universal à informação.
              </p>
              <p className="text-lg text-gray-600">
                Através de tecnologia de ponta e inovação constante, estamos construindo 
                a próxima geração de comunicação global via satélite.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Nossos Valores</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Inovação contínua
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Excelência em qualidade
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Compromisso com o cliente
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Sustentabilidade
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Nossa Jornada</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24 font-bold text-blue-600">2020</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Fundação</h3>
                <p className="text-gray-600">Início das operações com visão de revolucionar a conectividade global.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24 font-bold text-blue-600">2021</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Primeiro Satélite</h3>
                <p className="text-gray-600">Lançamento bem-sucedido do nosso primeiro satélite de comunicação.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24 font-bold text-blue-600">2023</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Expansão Global</h3>
                <p className="text-gray-600">Cobertura expandida para mais de 100 países em todos os continentes.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24 font-bold text-blue-600">2025</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Próxima Geração</h3>
                <p className="text-gray-600">Desenvolvimento de tecnologia 5G via satélite para maior velocidade.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Nossa Equipe</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Profissionais altamente qualificados e apaixonados por inovação, 
            trabalhando juntos para construir o futuro da comunicação.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                👨‍💼
              </div>
              <h3 className="text-xl font-bold mb-2">João Silva</h3>
              <p className="text-gray-600 mb-1">CEO & Fundador</p>
              <p className="text-sm text-gray-500">Engenheiro Aeroespacial, MIT</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                👩‍💻
              </div>
              <h3 className="text-xl font-bold mb-2">Maria Santos</h3>
              <p className="text-gray-600 mb-1">CTO</p>
              <p className="text-sm text-gray-500">Doutora em Telecomunicações</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                👨‍🔬
              </div>
              <h3 className="text-xl font-bold mb-2">Carlos Oliveira</h3>
              <p className="text-gray-600 mb-1">Diretor de Pesquisa</p>
              <p className="text-sm text-gray-500">PhD em Astrofísica</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
