import Header from './Header';
import Navigation from './Navigation';

const Layout = ({ children, title, subtitle, currentView, onViewChange, onAddClick }) => {
  return (
    <div className="min-h-screen pb-24">
      <Header title={title} subtitle={subtitle} />
      <main className="px-4">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>
      <Navigation 
        currentView={currentView} 
        onViewChange={onViewChange}
        onAddClick={onAddClick}
      />
    </div>
  );
};

export default Layout;