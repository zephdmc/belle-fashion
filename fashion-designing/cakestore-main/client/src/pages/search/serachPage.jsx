import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard';
import { searchProducts } from '../../services/searchService';
import ProductFilter from '../../components/products/ProductFilter';
import Loader from '../../components/common/Loader';

export default function SearchResultsPage() {
    const [results, setResults] = useState({
        products: [],
        loading: true,
        error: null,
        count: 0
    });
    
    const [filters, setFilters] = useState({
        category: '',
        occasion: '',
        size: '',
        color: '',
        minPrice: '',
        maxPrice: '',
        sort: 'name_asc'
    });
    
    const [showFilters, setShowFilters] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // Get search query and filters from URL
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const occasion = searchParams.get('occasion') || '';

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query.trim() && !category && !occasion) {
                navigate('/products');
                return;
            }

            try {
                setResults(prev => ({ ...prev, loading: true, error: null }));

                // Build search parameters
                const searchParams = {
                    search: query,
                    category: category || filters.category,
                    occasion: occasion || filters.occasion,
                    size: filters.size,
                    color: filters.color,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    sort: filters.sort
                };

                const response = await searchProducts(searchParams);
                console.log('Search response:', response);

                setResults({
                    products: response.data || response.products || response,
                    loading: false,
                    error: null,
                    count: response.count || response.data?.length || response.length || 0
                });
            } catch (err) {
                console.error('Search error:', err);
                setResults({
                    products: [],
                    loading: false,
                    error: err.message || 'Failed to search products',
                    count: 0
                });
            }
        };

        fetchSearchResults();
    }, [query, category, occasion, filters, navigate]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        
        // Update URL with filters
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (newFilters.category) params.set('category', newFilters.category);
        if (newFilters.occasion) params.set('occasion', newFilters.occasion);
        
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            occasion: '',
            size: '',
            color: '',
            minPrice: '',
            maxPrice: '',
            sort: 'name_asc'
        });
        
        // Clear filter params from URL
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };

    const getSearchTitle = () => {
        if (query && category) {
            return `"${query}" in ${category}`;
        }
        if (query) {
            return `"${query}"`;
        }
        if (category) {
            return `${category} Collection`;
        }
        if (occasion) {
            return `${occasion} Wear`;
        }
        return "Search Results";
    };

    const getSearchDescription = () => {
        if (query && category) {
            return `Search results for "${query}" in ${category} category`;
        }
        if (query) {
            return `Search results for "${query}"`;
        }
        if (category) {
            return `Browse our ${category} collection`;
        }
        if (occasion) {
            return `Find perfect outfits for ${occasion}`;
        }
        return "Browse our fashion collection";
    };

    if (results.loading) return <Loader message="Searching fashion items..." />;
    
    if (results.error) return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
                <div className="text-red-500 text-lg mb-4">Search Error</div>
                <p className="text-gray-600 mb-6">{results.error}</p>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                    Browse All Fashion Items
                </button>
            </div>
        </div>
    );

    const hasActiveFilters = filters.category || filters.occasion || filters.size || 
                           filters.color || filters.minPrice || filters.maxPrice;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {getSearchTitle()}
                </h1>
                <p className="text-gray-600 mb-4">{getSearchDescription()}</p>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="text-gray-700">
                        {results.count} {results.count === 1 ? 'item' : 'items'} found
                    </p>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                            </svg>
                            Filters
                        </button>
                        
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-primary hover:text-primary-dark underline transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            {showFilters && (
                <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
                    <ProductFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearFilters}
                    />
                </div>
            )}

            {/* Results Grid */}
            {results.count > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {results.products.map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product}
                            showQuickAdd={true}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        We couldn't find any fashion items matching your search criteria. 
                        Try adjusting your filters or browse our complete collection.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={clearFilters}
                            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Clear Search & Filters
                        </button>
                        <button
                            onClick={() => navigate('/products')}
                            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Browse All Collections
                        </button>
                        <button
                            onClick={() => navigate('/custom-order')}
                            className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors"
                        >
                            Create Custom Design
                        </button>
                    </div>
                </div>
            )}

            {/* Load More functionality can be added here */}
            {results.count > 0 && results.products.length < results.count && (
                <div className="text-center mt-12">
                    <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                        Load More Items
                    </button>
                </div>
            )}
        </div>
    );
}