exports.id=65,exports.ids=[65],exports.modules={10927:(e,r,t)=>{Promise.resolve().then(t.t.bind(t,12994,23)),Promise.resolve().then(t.t.bind(t,96114,23)),Promise.resolve().then(t.t.bind(t,9727,23)),Promise.resolve().then(t.t.bind(t,79671,23)),Promise.resolve().then(t.t.bind(t,41868,23)),Promise.resolve().then(t.t.bind(t,84759,23))},86735:(e,r,t)=>{Promise.resolve().then(t.bind(t,58640))},50908:(e,r,t)=>{"use strict";t.d(r,{Ho:()=>s,aC:()=>l});var o=t(10326),i=t(17577);let n={user:null,token:null,isAuthenticated:!1,loading:!0,error:null},a=(0,i.createContext)({...n,login:async()=>{},logout:()=>{},clearError:()=>{}}),s=({children:e})=>{let[r,t]=(0,i.useState)(n);(0,i.useEffect)(()=>{(async()=>{try{t({...n,loading:!1});return}catch(e){console.error("Failed to initialize auth:",e),t({...n,loading:!1,error:"Failed to initialize authentication"})}})()},[]);let s=async(e,r)=>{t(e=>({...e,loading:!0,error:null}));try{if("admin@flowlytix.com"===e&&"admin"===r){let e={id:"1",email:"admin@flowlytix.com",name:"Admin User",role:"admin",permissions:["read","write","delete"],lastLoginAt:new Date};t({user:e,token:"mock-jwt-token",isAuthenticated:!0,loading:!1,error:null})}else throw Error("Invalid credentials")}catch(e){throw t({...n,loading:!1,error:e instanceof Error?e.message:"Login failed"}),e}},l={...r,login:s,logout:()=>{t({...n,loading:!1})},clearError:()=>{t(e=>({...e,error:null}))}};return o.jsx(a.Provider,{value:l,children:e})},l=()=>{let e=(0,i.useContext)(a);if(!e)throw Error("useAuth must be used within an AuthProvider");return e}},58640:(e,r,t)=>{"use strict";t.d(r,{ClientProviders:()=>K});var o=t(10326),i=t(15157),n=t(17654),a=t(95148),s=t(39667),l=t(2659),d=t(44976),c=t(85999),h=t(17968),p=t.n(h),f=t(34156);let m={primary:{50:"#f0f0ff",100:"#e6e6ff",200:"#d1d1ff",300:"#b3b3ff",400:"#9191ff",500:"#513ff2",600:"#4a38db",700:"#3d2fb8",800:"#312695",900:"#251e72"},secondary:{50:"#f8f9ff",100:"#f1f4ff",200:"#e3e9ff",300:"#d1dcff",400:"#beccff",500:"#6b52f5",600:"#614ade",700:"#5140ba",800:"#413696",900:"#312b72"},neutral:{50:"#f8fafc",100:"#f1f5f9",200:"#e2e8f0",300:"#cbd5e1",400:"#94a3b8",500:"#64748b",600:"#475569",700:"#334155",800:"#1e293b",900:"#0f172a"},success:{50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534",900:"#14532d"},warning:{50:"#fffbeb",100:"#fef3c7",200:"#fde68a",300:"#fcd34d",400:"#fbbf24",500:"#f59e0b",600:"#d97706",700:"#b45309",800:"#92400e",900:"#78350f"},error:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d"}},x=(0,f.Z)({palette:{primary:{main:m.primary[500],light:m.primary[300],dark:m.primary[700],contrastText:"#ffffff"},secondary:{main:m.secondary[500],light:m.secondary[300],dark:m.secondary[700],contrastText:"#ffffff"},error:{main:m.error[500],light:m.error[300],dark:m.error[700],contrastText:"#ffffff"},warning:{main:m.warning[500],light:m.warning[300],dark:m.warning[700],contrastText:"#ffffff"},success:{main:m.success[500],light:m.success[300],dark:m.success[700],contrastText:"#ffffff"},grey:m.neutral,background:{default:"#ffffff",paper:"#ffffff"},text:{primary:m.neutral[900],secondary:m.neutral[600],disabled:m.neutral[400]}},typography:{fontFamily:p().style.fontFamily,h1:{fontSize:"2.5rem",fontWeight:700,lineHeight:1.2,letterSpacing:"-0.025em"},h2:{fontSize:"2rem",fontWeight:700,lineHeight:1.3,letterSpacing:"-0.025em"},h3:{fontSize:"1.5rem",fontWeight:600,lineHeight:1.4,letterSpacing:"-0.025em"},h4:{fontSize:"1.25rem",fontWeight:600,lineHeight:1.4,letterSpacing:"-0.025em"},h5:{fontSize:"1.125rem",fontWeight:600,lineHeight:1.4,letterSpacing:"-0.025em"},h6:{fontSize:"1rem",fontWeight:600,lineHeight:1.4,letterSpacing:"-0.025em"},body1:{fontSize:"1rem",lineHeight:1.6,color:m.neutral[700]},body2:{fontSize:"0.875rem",lineHeight:1.6,color:m.neutral[600]},caption:{fontSize:"0.75rem",lineHeight:1.4,color:m.neutral[500]},button:{textTransform:"none",fontWeight:600}},shape:{borderRadius:8},spacing:8,components:{MuiButton:{styleOverrides:{root:{borderRadius:8,textTransform:"none",fontWeight:600,fontSize:"0.875rem",padding:"8px 16px",boxShadow:"none","&:hover":{boxShadow:"none"}},contained:{background:`linear-gradient(135deg, ${m.primary[500]} 0%, ${m.secondary[500]} 100%)`,"&:hover":{background:`linear-gradient(135deg, ${m.primary[600]} 0%, ${m.secondary[600]} 100%)`}},outlined:{borderColor:m.primary[500],color:m.primary[500],"&:hover":{borderColor:m.primary[600],backgroundColor:m.primary[50]}}}},MuiCard:{styleOverrides:{root:{borderRadius:12,boxShadow:"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",border:`1px solid ${m.neutral[200]}`,"&:hover":{boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"}}}},MuiPaper:{styleOverrides:{root:{borderRadius:12,boxShadow:"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"}}},MuiTableHead:{styleOverrides:{root:{backgroundColor:m.neutral[50],"& .MuiTableCell-head":{fontWeight:600,fontSize:"0.875rem",color:m.neutral[700],textTransform:"uppercase",letterSpacing:"0.05em"}}}},MuiChip:{styleOverrides:{root:{borderRadius:6,fontWeight:500,fontSize:"0.75rem"}}},MuiTextField:{styleOverrides:{root:{"& .MuiOutlinedInput-root":{borderRadius:8,"&:hover .MuiOutlinedInput-notchedOutline":{borderColor:m.primary[400]},"&.Mui-focused .MuiOutlinedInput-notchedOutline":{borderColor:m.primary[500]}}}}},MuiAppBar:{styleOverrides:{root:{backgroundColor:"#ffffff",color:m.neutral[900],boxShadow:"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",borderBottom:`1px solid ${m.neutral[200]}`}}},MuiDrawer:{styleOverrides:{paper:{backgroundColor:"#ffffff",borderRight:`1px solid ${m.neutral[200]}`,boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"}}}}});var u=t(8106);let b=(0,u.iv)`
  /* CSS Reset and Base Styles */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    background-color: ${m.neutral[50]};
    color: ${m.neutral[900]};
    font-family:
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      sans-serif;
    font-size: 16px;
    line-height: 1.5;
    overflow-x: hidden;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${m.neutral[100]};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${m.neutral[300]};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${m.neutral[400]};
  }

  /* Focus Styles */
  :focus-visible {
    outline: 2px solid ${m.primary[500]};
    outline-offset: 2px;
  }

  /* Selection Styles */
  ::selection {
    background-color: ${m.primary[100]};
    color: ${m.primary[900]};
  }

  /* Links */
  a {
    color: ${m.primary[500]};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${m.primary[600]};
    }

    &:focus {
      outline: 2px solid ${m.primary[500]};
      outline-offset: 2px;
    }
  }

  /* Headings */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 0.5rem;
    color: ${m.neutral[900]};
  }

  /* Paragraphs */
  p {
    margin-bottom: 1rem;
    color: ${m.neutral[700]};
  }

  /* Lists */
  ul,
  ol {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }

  li {
    margin-bottom: 0.25rem;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Buttons */
  button {
    cursor: pointer;
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    padding: 0;
    margin: 0;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  /* Form Elements */
  input,
  textarea,
  select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    border: 1px solid ${m.neutral[300]};
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    background-color: white;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${m.primary[500]};
      box-shadow: 0 0 0 3px ${m.primary[100]};
    }

    &:disabled {
      background-color: ${m.neutral[100]};
      cursor: not-allowed;
    }
  }

  /* Tables */
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1rem;
  }

  th,
  td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid ${m.neutral[200]};
  }

  th {
    background-color: ${m.neutral[50]};
    font-weight: 600;
    color: ${m.neutral[700]};
  }

  /* Utility Classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .loading {
    opacity: 0.7;
    pointer-events: none;
  }

  .error {
    color: ${m.error[500]};
  }

  .success {
    color: ${m.success[500]};
  }

  .warning {
    color: ${m.warning[500]};
  }

  /* Animation Classes */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .fade-in {
    animation: fadeIn 0.3s ease;
  }

  .slide-in {
    animation: slideIn 0.3s ease;
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    h3 {
      font-size: 1.25rem;
    }
  }

  /* Print Styles */
  @media print {
    * {
      box-shadow: none !important;
      text-shadow: none !important;
    }

    body {
      background: white !important;
      color: black !important;
    }

    .no-print {
      display: none !important;
    }
  }

  /* Dark Mode Support (Future Enhancement) */
  @media (prefers-color-scheme: dark) {
    /* Dark mode styles will be added here when implementing dark mode */
  }
`;var g=t(50908),y=t(17577),w=t(35047),j=t(71728),v=t(98139),k=t(30274);let S=["/auth/login","/auth/register","/subscriptions","/","/test-subscriptions"],Z=({children:e})=>{let{isAuthenticated:r,loading:t}=(0,g.aC)(),i=(0,w.useRouter)(),n=(0,w.usePathname)();return((0,y.useEffect)(()=>{!S.includes(n)&&(t||r||i.push("/auth/login"))},[r,t,n,i]),S.includes(n))?o.jsx(o.Fragment,{children:e}):t?(0,o.jsxs)(j.Z,{sx:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",bgcolor:"#f8fafc"},children:[o.jsx(v.Z,{size:48,sx:{mb:2}}),o.jsx(k.Z,{variant:"h6",color:"textSecondary",children:"Loading Dashboard..."})]}):r?o.jsx(o.Fragment,{children:e}):null};var C=t(60893),P=t(42265),z=t(87839),$=t(20747);class F extends y.Component{constructor(e){super(e),this.handleReload=()=>{window.location.reload()},this.handleReset=()=>{this.setState({hasError:!1,error:null,errorInfo:null})},this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(e){return{hasError:!0,error:e,errorInfo:null}}componentDidCatch(e,r){this.setState({error:e,errorInfo:r})}render(){return this.state.hasError?this.props.fallback?this.props.fallback:o.jsx(j.Z,{sx:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",p:3,bgcolor:"background.default"},children:(0,o.jsxs)(C.Z,{elevation:3,sx:{p:4,textAlign:"center",maxWidth:500,width:"100%"},children:[o.jsx(z.Z,{sx:{fontSize:64,color:"error.main",mb:2}}),o.jsx(k.Z,{variant:"h4",component:"h1",gutterBottom:!0,color:"error",children:"Something went wrong"}),o.jsx(k.Z,{variant:"body1",color:"text.secondary",sx:{mb:3},children:"We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists."}),(0,o.jsxs)(j.Z,{sx:{display:"flex",gap:2,justifyContent:"center"},children:[o.jsx(P.Z,{variant:"contained",onClick:this.handleReload,startIcon:o.jsx($.Z,{}),children:"Reload Page"}),o.jsx(P.Z,{variant:"outlined",onClick:this.handleReset,children:"Try Again"})]}),!1]})}):this.props.children}}var R=t(33198),I=t(99207),D=t(84979),E=t(71411),T=t(24003),W=t(78969),M=t(25886),A=t(19074),H=t(8500),O=t(87735),L=t(76383),B=t(90935),U=t(56389),_=t(82400),N=t(90434);let X=[{title:"Dashboard",path:"/",icon:o.jsx(H.Z,{}),description:"Overview and analytics"},{title:"Customers",path:"/customers",icon:o.jsx(O.Z,{}),description:"Customer management"},{title:"Subscriptions",path:"/subscriptions",icon:o.jsx(L.Z,{}),description:"License management"},{title:"Analytics",path:"/analytics",icon:o.jsx(B.Z,{}),description:"Reports and insights"}],G=[{title:"Add Customer",path:"/customers/create",icon:o.jsx(U.Z,{}),description:"Register new customer"},{title:"Generate License",path:"/subscriptions/create",icon:o.jsx(L.Z,{}),description:"Create subscription"}],Y=({window:e})=>{let r=(0,w.useRouter)(),t=(0,w.usePathname)(),{user:i,logout:n}=(0,g.aC)(),a=async()=>{await n(),r.push("/auth/login")},s=e=>"/"===e?"/"===t:t.startsWith(e),l=(0,o.jsxs)(j.Z,{sx:{height:"100%",display:"flex",flexDirection:"column"},children:[(0,o.jsxs)(j.Z,{sx:{p:3,background:"linear-gradient(135deg, #B4C7E3 0%, #FCF2E8 100%)",color:"#1e293b"},children:[o.jsx(k.Z,{variant:"h6",component:"div",fontWeight:"bold",children:"Flowlytix Dashboard"}),o.jsx(k.Z,{variant:"body2",sx:{opacity:.8},children:"Subscription Management"})]}),i&&o.jsx(j.Z,{sx:{p:2,background:"linear-gradient(135deg, #FCF2E8 0%, #B4C7E3 50%)",borderBottom:"1px solid rgba(180, 199, 227, 0.3)"},children:(0,o.jsxs)(j.Z,{sx:{display:"flex",alignItems:"center",gap:2},children:[o.jsx(R.Z,{sx:{background:"linear-gradient(135deg, #B4C7E3 0%, #FCF2E8 100%)",color:"#1e293b",fontWeight:"bold"},children:i.name?.charAt(0).toUpperCase()}),(0,o.jsxs)(j.Z,{sx:{flex:1},children:[o.jsx(k.Z,{variant:"subtitle2",fontWeight:600,sx:{color:"#1e293b"},children:i.name}),o.jsx(k.Z,{variant:"body2",sx:{color:"rgba(30, 41, 59, 0.7)"},children:i.email})]})]})}),o.jsx(I.Z,{}),(0,o.jsxs)(j.Z,{sx:{flex:1,overflow:"auto"},children:[o.jsx(D.Z,{sx:{px:1,py:2},children:X.map(e=>o.jsx(E.ZP,{disablePadding:!0,sx:{mb:.5},children:o.jsx(N.default,{href:e.path,style:{textDecoration:"none",width:"100%"},children:(0,o.jsxs)(T.Z,{selected:s(e.path),sx:{borderRadius:2,"&.Mui-selected":{bgcolor:"primary.main",color:"white","&:hover":{bgcolor:"primary.dark"},"& .MuiListItemIcon-root":{color:"white"}}},children:[o.jsx(W.Z,{sx:{color:s(e.path)?"white":"action.active"},children:e.icon}),o.jsx(M.Z,{primary:e.title,secondary:e.description,primaryTypographyProps:{fontWeight:s(e.path)?600:400},secondaryTypographyProps:{sx:{color:s(e.path)?"rgba(255,255,255,0.7)":"textSecondary",fontSize:"0.75rem"}}})]})})},e.path))}),o.jsx(I.Z,{sx:{mx:2}}),(0,o.jsxs)(j.Z,{sx:{p:2},children:[o.jsx(k.Z,{variant:"overline",color:"textSecondary",fontWeight:"bold",sx:{mb:1,display:"block"},children:"Quick Actions"}),o.jsx(D.Z,{sx:{p:0},children:G.map(e=>o.jsx(E.ZP,{disablePadding:!0,sx:{mb:.5},children:o.jsx(N.default,{href:e.path,style:{textDecoration:"none",width:"100%"},children:(0,o.jsxs)(T.Z,{sx:{borderRadius:2,py:.5,"&:hover":{bgcolor:"action.hover"}},children:[o.jsx(W.Z,{sx:{minWidth:36},children:e.icon}),o.jsx(M.Z,{primary:e.title,secondary:e.description,primaryTypographyProps:{fontSize:"0.875rem"},secondaryTypographyProps:{fontSize:"0.75rem"}})]})})},e.path))})]})]}),o.jsx(I.Z,{}),o.jsx(j.Z,{sx:{p:2},children:o.jsx(P.Z,{fullWidth:!0,variant:"outlined",startIcon:o.jsx(_.Z,{}),onClick:a,sx:{mb:1},children:"Logout"})})]});return o.jsx(j.Z,{sx:{display:"flex"},children:o.jsx(j.Z,{component:"nav",sx:{width:{sm:280},flexShrink:{sm:0}},"aria-label":"navigation",children:o.jsx(A.ZP,{container:void 0!==e?()=>e().document.body:void 0,variant:"permanent",open:!0,sx:{display:{xs:"none",sm:"block"},"& .MuiDrawer-paper":{boxSizing:"border-box",width:280,borderRight:"1px solid",borderColor:"divider"}},children:l})})})},q=({children:e})=>(0,o.jsxs)(j.Z,{sx:{display:"flex",minHeight:"100vh"},children:[o.jsx(Y,{}),o.jsx(j.Z,{component:"main",sx:{flexGrow:1,background:"linear-gradient(135deg, rgba(252, 242, 232, 0.05) 0%, rgba(180, 199, 227, 0.05) 100%)",minHeight:"100vh"},children:e})]}),Q=({children:e})=>{let r=(0,w.usePathname)();return["/auth/login","/auth/register","/auth/forgot-password"].some(e=>r.startsWith(e))?o.jsx(o.Fragment,{children:e}):o.jsx(q,{children:e})},J=new l.S({defaultOptions:{queries:{staleTime:3e5,retry:3,refetchOnWindowFocus:!1},mutations:{retry:1}}});function K({children:e}){return o.jsx(i.Z,{children:o.jsx(d.aH,{client:J,children:(0,o.jsxs)(n.Z,{theme:x,children:[o.jsx(a.ZP,{}),o.jsx(s.Z,{styles:b}),o.jsx(F,{children:(0,o.jsxs)(g.Ho,{children:[o.jsx(Z,{children:o.jsx(Q,{children:e})}),o.jsx(c.x7,{position:"top-right",toastOptions:{duration:5e3,style:{background:"#fff",color:"#1a1a1a",border:"1px solid #e0e0e0",fontSize:"14px"}}})]})}),!1]})})})}},32039:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>a,metadata:()=>n});var o=t(19510);let i=(0,t(68570).createProxy)(String.raw`/Users/mohsinali/Documents/flowlytix-subscription-dashboard/src/components/providers/ClientProviders.tsx#ClientProviders`),n={title:"Flowlytix Dashboard | Subscription Management",description:"Administrative dashboard for Flowlytix subscription management system",keywords:["flowlytix","dashboard","subscription","management","admin"],authors:[{name:"Flowlytix Team"}],creator:"Flowlytix Team",metadataBase:new URL(process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"),robots:{index:!1,follow:!1},openGraph:{type:"website",locale:"en_US",url:process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000",title:"Flowlytix Dashboard",description:"Administrative dashboard for subscription management",siteName:"Flowlytix Dashboard"},twitter:{card:"summary_large_image",title:"Flowlytix Dashboard",description:"Administrative dashboard for subscription management"}};function a({children:e}){return(0,o.jsxs)("html",{lang:"en",children:[(0,o.jsxs)("head",{children:[o.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),o.jsx("meta",{name:"theme-color",content:"#513ff2"}),o.jsx("link",{rel:"icon",href:"/favicon.ico"}),o.jsx("link",{rel:"apple-touch-icon",href:"/apple-touch-icon.png"}),o.jsx("link",{rel:"manifest",href:"/manifest.json"})]}),o.jsx("body",{children:o.jsx(i,{children:e})})]})}}};