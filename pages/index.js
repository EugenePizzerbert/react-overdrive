import Overdrive from './overdrive'
import Link from 'next/link'
import {css} from 'glamor'

const box = css({
    width: '50px',
    height: '50px',
    background: '#3cafe4'
});

const image = css({
    boxSizing: 'border-box',
    background: '#fff',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '1px solid #ccc',
    padding: '5px',
    margin: '10px'
});

const container = css({
    textAlign: 'center',
    ' a': {
        display: 'inline-block'
    }
});

const page = () => {
    return (
        <div>
            <h1 id="header">Page 1</h1>
            <Link href="/another"><a id="link">Page 2</a></Link>
            <Overdrive id="box">
                <div {...box}></div>
            </Overdrive>
            <Overdrive id="h">
                <h1>Hi</h1>
            </Overdrive>

            <div {...container}>
                <Link href="/bender">
                    <a>
                        <Overdrive id="bender">
                            <img {...image} src="/static/bender_small.jpg"/>
                        </Overdrive>
                    </a>
                </Link>

                <Link href="/face2">
                    <a>
                        <Overdrive id="face2">
                            <img {...image} src="/static/fry.jpg"/>
                        </Overdrive>
                    </a>
                </Link>
                <Link href="/face3">
                    <a>
                        <Overdrive id="face3">
                            <img {...image} src="/static/leela_small.jpg"/>
                        </Overdrive>
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default page;
