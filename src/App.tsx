import { SetStateAction, Suspense, useState, useTransition} from 'react'
import {Layout, Menu} from '@arco-design/web-react'
import { IconHome, IconCalendar } from '@arco-design/web-react/icon';
import IndexPage from './pages/IndexPage.js'
import ArtistPage from './pages/ArtistPage.js'
import '@arco-design/web-react/dist/css/arco.css';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const Sider = Layout.Sider;
const Content = Layout.Content;
const collapsedWidth = 60;
const normalWidth = 220;

export default function App() {
    return (
        <Suspense fallback={<BigSpinner/>}>
            <Router/>
        </Suspense>
    );
}

function Router() {
    const [page, setPage] = useState('/');
    const [isPending, startTransition] = useTransition();
    const [collapsed, setCollapsed] = useState(false);
    const [siderWidth, setSiderWidth] = useState(normalWidth);

    const onCollapse = (collapsed: boolean | ((prevState: boolean) => boolean)) => {
        setCollapsed(collapsed);
        setSiderWidth(collapsed ? collapsedWidth : normalWidth);
    };

    const handleMoving = (_: any, {width}: any) => {
        if (width > collapsedWidth) {
            setSiderWidth(width);
            setCollapsed(!(width > collapsedWidth + 20));
        } else {
            setSiderWidth(collapsedWidth);
            setCollapsed(true);
        }
    };


    function navigate(url: SetStateAction<string>) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
        <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
        <ArtistPage
            artist={{
              id: 'the-beatles',
              name: 'The Beatles',
            }}
        />
    );
  }
  return (
      <Layout>
          <Content style={{ background: 'rgb(240,255,255)', textAlign: 'center', padding: '30px',paddingTop:'0px' }}>
              <div>{content}</div>
          </Content>
      </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
