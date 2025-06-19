'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import StatsCard from './StatsCard';
import SearchBar from '../common/SearchBar';
import ApiConfig from '../common/ApiConfig';
import ArticleGrid from '../articles/ArticleGrid';
import PayoutTable from '../payout/PayoutTable';
import ArticleTypeChart from '../analytics/ArticleTypeChart';
import AuthorBarChart from '../analytics/AuthorBarChart';
import TrendLineChart from '../analytics/TrendLineChart';
import useArticles from '@/hooks/useArticles';
import useFilters from '@/hooks/useFilters';
import usePayouts from '@/hooks/usePayouts';
import { FileText, TrendingUp, Calendar, DollarSign } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showApiConfig, setShowApiConfig] = useState(false);

    const {
        articles,
        filteredArticles,
        setFilteredArticles,
        loading,
        error,
        apiKey,
        setApiKey,
        fetchNewsData
    } = useArticles();

    const {
        searchTerm,
        setSearchTerm,
        filters,
        setFilters
    } = useFilters(articles, setFilteredArticles);

    const {
        globalPayoutRate,
        setGlobalPayoutRate,
        authorPayouts,
        updateAuthorPayout,
        getAuthorStats
    } = usePayouts(filteredArticles);

    const totalPayout = getAuthorStats().reduce((sum, stat) => sum + stat.payout, 0);

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Header
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                setShowApiConfig={setShowApiConfig}
            />

            <div className="flex">
                <Sidebar
                    darkMode={darkMode}
                    sidebarOpen={sidebarOpen}
                    filters={filters}
                    setFilters={setFilters}
                    globalPayoutRate={globalPayoutRate}
                    setGlobalPayoutRate={setGlobalPayoutRate}
                    user={user}
                />

                <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
                    {error && (
                        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800 mb-2">{error}</p>
                            <button
                                onClick={() => setShowApiConfig(!showApiConfig)}
                                className="text-sm text-yellow-700 underline hover:text-yellow-900"
                            >
                                Configure API Key
                            </button>
                        </div>
                    )}

                    {showApiConfig && (
                        <ApiConfig
                            darkMode={darkMode}
                            apiKey={apiKey}
                            setApiKey={setApiKey}
                            onSave={() => {
                                localStorage.setItem('newsApiKey', apiKey);
                                setShowApiConfig(false);
                                fetchNewsData();
                            }}
                        />
                    )}

                    <SearchBar
                        darkMode={darkMode}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <StatsCard
                            darkMode={darkMode}
                            icon={FileText}
                            iconColor="text-blue-500"
                            title="Total Articles"
                            value={filteredArticles.length}
                        />
                        <StatsCard
                            darkMode={darkMode}
                            icon={TrendingUp}
                            iconColor="text-green-500"
                            title="News Articles"
                            value={filteredArticles.filter(a => a.type === 'news').length}
                        />
                        <StatsCard
                            darkMode={darkMode}
                            icon={Calendar}
                            iconColor="text-purple-500"
                            title="Blog Posts"
                            value={filteredArticles.filter(a => a.type === 'blog').length}
                        />
                        {user?.isAdmin && (
                            <StatsCard
                                darkMode={darkMode}
                                icon={DollarSign}
                                iconColor="text-yellow-500"
                                title="Total Payout"
                                value={`$${totalPayout.toFixed(2)}`}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <ArticleTypeChart
                            darkMode={darkMode}
                            articles={filteredArticles}
                        />
                        <AuthorBarChart
                            darkMode={darkMode}
                            authorStats={getAuthorStats()}
                            isAdmin={user?.isAdmin}
                        />
                        <TrendLineChart
                            darkMode={darkMode}
                            articles={filteredArticles}
                        />
                    </div>

                    {user?.isAdmin && (
                        <PayoutTable
                            darkMode={darkMode}
                            authorStats={getAuthorStats()}
                            authorPayouts={authorPayouts}
                            globalPayoutRate={globalPayoutRate}
                            updateAuthorPayout={updateAuthorPayout}
                        />
                    )}

                    <ArticleGrid
                        darkMode={darkMode}
                        articles={filteredArticles}
                        loading={loading}
                    />
                </main>
            </div>
        </div>
    );
}