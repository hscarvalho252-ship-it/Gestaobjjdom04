
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Student, UserRole, Payment, Product, Post, Instructor, Subscription, AdminTask } from './types';
import { Icons, Logo } from './constants';
import Dashboard from './views/Dashboard';
import StudentList from './views/StudentList';
import StudentForm from './views/StudentForm';
import StudentProfile from './views/StudentProfile';
import Store from './views/Store';
import Payments from './views/Payments';
import Community from './views/Community';
import Login from './views/Login';
import InstructorList from './views/InstructorList';
import InstructorForm from './views/InstructorForm';
import TaskList from './views/TaskList';
import AiAssistant from './views/AiAssistant';

const INITIAL_SUBSCRIPTION: Subscription = {
  plan: 'Dojo Hub Premium',
  startDate: new Date().toISOString(),
  studentLimit: 150,
  price: 0
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [academyLogo, setAcademyLogo] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription>(INITIAL_SUBSCRIPTION);
  const [premiumStaffPrice, setPremiumStaffPrice] = useState(30.00);
  const [adminPixKey, setAdminPixKey] = useState('seu-pix-aqui');
  const [adminPhone, setAdminPhone] = useState('5500000000000');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('gestao_bjj_elite_data_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStudents(parsed.students || []);
        setInstructors(parsed.instructors || []);
        setTasks(parsed.tasks || []);
        setPayments(parsed.payments || []);
        setPosts(parsed.posts || []);
        setAcademyLogo(parsed.academyLogo || null);
        setSubscription(parsed.subscription || INITIAL_SUBSCRIPTION);
        if (parsed.premiumStaffPrice) setPremiumStaffPrice(parsed.premiumStaffPrice);
        if (parsed.adminPixKey) setAdminPixKey(parsed.adminPixKey);
        if (parsed.adminPhone) setAdminPhone(parsed.adminPhone);
        if (parsed.products) setProducts(parsed.products);
      } catch (e) {
        console.error("Erro ao carregar dados do localStorage", e);
      }
    } else {
      const welcomePost: Post = {
        id: 'post-0',
        authorId: 'admin',
        authorName: 'Sensei Ben',
        role: 'Administrador',
        content: 'Bem-vindo ao centro de comando. Como Administrador, você deve agora admitir seu Time Técnico e matricular seus Guerreiros. OSS!',
        timestamp: new Date().toISOString()
      };
      setPosts([welcomePost]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gestao_bjj_elite_data_v2', JSON.stringify({ 
      students, instructors, tasks, payments, posts, academyLogo, subscription, products, premiumStaffPrice, adminPixKey, adminPhone 
    }));
  }, [students, instructors, tasks, payments, posts, academyLogo, subscription, products, premiumStaffPrice, adminPixKey, adminPhone]);

  // Alunos
  const handleAddStudent = (s: Student) => setStudents(prev => [...prev, s]);
  const handleUpdateStudent = (id: string, updated: Partial<Student>) => setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    // Remove pagamentos órfãos
    setPayments(prev => prev.filter(p => p.payerId !== id));
  };

  // Staff
  const handleAddInstructor = (instructor: Instructor) => setInstructors(prev => [...prev, instructor]);
  const handleUpdateInstructor = (id: string, updated: Partial<Instructor>) => setInstructors(prev => prev.map(i => i.id === id ? { ...i, ...updated } : i));
  const handleDeleteInstructor = (id: string) => {
    setInstructors(prev => prev.filter(i => i.id !== id));
    // Remove pagamentos órfãos de staff
    setPayments(prev => prev.filter(p => p.payerId !== id));
  };

  // Financeiro
  const handleAddPayment = (p: Payment) => setPayments(prev => [...prev, p]);
  const handleUpdatePayment = (id: string, updated: Partial<Payment>) => setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  const handleDeletePayment = (id: string) => setPayments(prev => prev.filter(p => p.id !== id));

  // Produtos
  const handleAddProduct = (p: Product) => setProducts(prev => [...prev, p]);
  const handleUpdateProduct = (id: string, updated: Partial<Product>) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  const handleDeleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  // Mural e Tarefas
  const handleAddPost = (p: Post) => setPosts(prev => [p, ...prev]);
  const handleAddTask = (task: AdminTask) => setTasks(prev => [...prev, task]);
  const handleUpdateTask = (id: string, updated: Partial<AdminTask>) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  const handleDeleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const handleLogout = () => setCurrentUser(null);

  if (!currentUser) return <Login onLogin={setCurrentUser} instructors={instructors} students={students} academyLogo={academyLogo} />;

  const displayLogo = (currentUser.role !== 'Administrador' && currentUser.role !== 'Aluno' && currentUser.academyLogo) 
    ? currentUser.academyLogo 
    : academyLogo;

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-[#020617] relative">
        
        {/* BOTÃO FLUTUANTE DA IA - SENSEI BEN */}
        {currentUser.role !== 'Aluno' && (
          <Link 
            to="/assistant" 
            className="fixed bottom-10 right-10 z-[100] w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-110 active:scale-95 transition-all group"
            title="Perguntar ao Sensei Ben"
          >
            <div className="absolute -top-12 right-0 bg-slate-900 border border-amber-500/20 px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
               <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Sensei Ben</span>
            </div>
            <Icons.Brain />
          </Link>
        )}

        {/* BOTÃO DE SAÍDA GLOBAL */}
        <div className="fixed top-6 right-6 md:top-10 md:right-14 z-[100]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white rounded-2xl transition-all shadow-2xl backdrop-blur-md group"
          >
            <div className="flex flex-col items-end">
              <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100">Sessão Segura</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Sair do Dojo</span>
            </div>
            <div className="p-2 bg-red-500/10 rounded-xl group-hover:bg-white/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </div>
          </button>
        </div>

        <aside className="w-72 bg-[#020617] text-slate-400 min-h-screen hidden md:flex flex-col border-r border-amber-500/10 z-20 sticky top-0 h-screen">
          <div className="p-10 flex flex-col items-center">
            <Link to="/" className="flex flex-col items-center gap-5 mb-12">
              <Logo className="w-24 h-24" customSrc={displayLogo} />
              <h1 className="text-2xl font-black text-white uppercase italic bjj-header-font text-center leading-none">
                DOJO <span className="text-amber-500">HUB</span>
              </h1>
            </Link>
          </div>
          <nav className="flex-1 px-8 space-y-2">
            {[
              { path: '/', label: 'Painel Central', icon: Icons.Dashboard, show: currentUser.role !== 'Aluno' },
              { path: '/assistant', label: 'Consultor IA', icon: Icons.Brain, show: currentUser.role !== 'Aluno' },
              { path: '/community', label: 'Mural do Dojo', icon: Icons.Community, show: true },
              { path: '/instructors', label: 'Time Técnico', icon: Icons.Users, show: currentUser.role === 'Administrador' },
              { path: '/tasks', label: 'Operações', icon: Icons.Brain, show: currentUser.role === 'Administrador' },
              { path: '/students', label: 'Guerreiros', icon: Icons.Users, show: currentUser.role !== 'Aluno' },
              { path: '/store', label: 'Arsenal', icon: Icons.Store, show: true },
              { path: '/finance', label: 'Tesouraria', icon: Icons.Finance, show: currentUser.role === 'Administrador' },
            ].filter(i => i.show).map((item) => (
              <Link key={item.path} to={item.path} className="flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-bold text-[11px] uppercase tracking-wider text-slate-500 hover:text-amber-500 hover:bg-amber-500/5 group">
                <item.icon />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-10 text-center">
             <p className="text-[8px] text-slate-700 font-black uppercase tracking-[0.4em]">Respeito • Hierarquia</p>
          </div>
        </aside>

        <main className="flex-1 overflow-x-hidden bg-[#020617]">
          <div className="p-6 md:p-14 max-w-7xl mx-auto w-full pt-24 md:pt-14">
            <Routes>
              <Route path="/" element={<Dashboard 
                students={students} instructors={instructors} payments={payments} tasks={tasks}
                user={currentUser} academyLogo={academyLogo} onLogoChange={setAcademyLogo}
                subscription={subscription} premiumStaffPrice={premiumStaffPrice} onUpdatePremiumPrice={setPremiumStaffPrice}
                adminPixKey={adminPixKey} onUpdateAdminPix={setAdminPixKey} adminPhone={adminPhone} onUpdateAdminPhone={setAdminPhone}
                onUpgrade={() => {}} onLogout={handleLogout}
              />} />
              <Route path="/assistant" element={<AiAssistant students={students} payments={payments} tasks={tasks} user={currentUser} />} />
              <Route path="/tasks" element={<TaskList tasks={tasks} onAdd={handleAddTask} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} />} />
              <Route path="/instructors" element={<InstructorList instructors={instructors} onUpdate={handleUpdateInstructor} onDelete={handleDeleteInstructor} premiumStaffPrice={premiumStaffPrice} onUpdatePrice={setPremiumStaffPrice} user={currentUser} />} />
              <Route path="/instructors/new" element={<InstructorForm onSubmit={handleAddInstructor} />} />
              <Route path="/instructors/edit/:id" element={<InstructorForm instructors={instructors} onSubmit={handleUpdateInstructor} onDelete={handleDeleteInstructor} />} />
              <Route path="/students" element={<StudentList students={students} onDelete={handleDeleteStudent} onUpdate={handleUpdateStudent} user={currentUser} subscription={subscription} />} />
              <Route path="/students/new" element={<StudentForm onSubmit={handleAddStudent} students={students} subscription={subscription} />} />
              <Route path="/students/edit/:id" element={<StudentForm students={students} onSubmit={handleUpdateStudent} subscription={subscription} />} />
              <Route path="/students/profile/:id" element={<StudentProfile students={students} onUpdate={handleUpdateStudent} onDelete={handleDeleteStudent} user={currentUser} />} />
              <Route path="/store" element={<Store products={products} instructors={instructors} user={currentUser} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} adminPixKey={adminPixKey} adminPhone={adminPhone} />} />
              <Route path="/finance" element={<Payments payments={payments} students={students} instructors={instructors} user={currentUser} adminPixKey={adminPixKey} onUpdateAdminPix={setAdminPixKey} premiumStaffPrice={premiumStaffPrice} onUpdatePremiumPrice={setPremiumStaffPrice} onAddPayment={handleAddPayment} onUpdatePayment={handleUpdatePayment} onDeletePayment={handleDeletePayment} />} />
              <Route path="/community" element={<Community posts={posts} user={currentUser} onPost={handleAddPost} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
