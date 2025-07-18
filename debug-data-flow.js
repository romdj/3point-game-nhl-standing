// Debug script to trace data flow
console.log('🔍 Starting data flow debug...');

// Test 1: Test GraphQL server directly
console.log('\n📡 Testing GraphQL server directly...');
fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    query: `query { 
      standings(date: "2025-04-05") { 
        teamName 
        divisionName 
        conferenceName 
        points 
        internationalSystemPoints 
        gamesPlayed 
        wins 
        losses 
        otLosses 
        otWins 
        regulationWins 
      } 
    }`
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ GraphQL Response:', data);
  console.log('📊 Teams count:', data.data?.standings?.length || 0);
  if (data.data?.standings?.length > 0) {
    console.log('🔍 Sample team:', data.data.standings[0]);
  }
})
.catch(err => {
  console.error('❌ GraphQL Error:', err);
});

// Test 2: Check if stores are accessible
console.log('\n🗄️ Testing Svelte stores...');
setTimeout(() => {
  // Check if window has any Svelte-related globals
  console.log('Window keys:', Object.keys(window).filter(k => k.includes('svelte') || k.includes('store')));
  
  // Try to access the store data through DevTools
  console.log('🔍 Try running this in DevTools:');
  console.log('- Check network tab for API calls');
  console.log('- Look for any console errors');
  console.log('- Try: window.location.reload()');
}, 1000);