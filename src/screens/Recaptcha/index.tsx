import React, { useState } from 'react';
import { CenterContent } from '../../components/Layout';
import Button from '../../components/Button';
import PurchaseLogService from '../../services/PurchaseLogService';
import Logo from '../../components/Logo';

const { ipcRenderer } = window.require('electron');

enum Status {
    None,
    Success,
    Failure,
}

const Recaptcha = () => {
    const [testingCart, setTestingCart] = useState(false);
    const [status, setStatus] = useState<Status>(Status.None);

    const testCart = async () => {
        setTestingCart(true);

        const addToCart = await ipcRenderer.invoke('add-to-cart', {
            item: {
                selected_size: { nike_id: '194494817784' },
                url:
                    'https://www.nike.com.br/Snkrs/Produto/Meia-Nike-BETRUE/153-169-211-222797',
            },
        });
        PurchaseLogService.create('add_to_cart', addToCart);

        if (addToCart.success) {
            setStatus(Status.Success);

            const removeFromCart = await ipcRenderer.invoke(
                'remove-from-cart',
                '194494817784'
            );
            PurchaseLogService.create('remove_from_cart', removeFromCart);
            setTestingCart(false);
        } else {
            setStatus(Status.Failure);
            setTestingCart(false);
        }
    };

    const renderStatus = () => {
        const getStatus = (): string => {
            if (status === Status.Success)
                return 'Teste realizado. Seu navegador passou no reCAPTCHA.';

            return 'Teste realizado. Não foi possível burlar o reCAPTCHA.';
        };

        const getStatusColor = (): string => {
            if (status === Status.Success) return '#4caf50';
            return '#fe0000';
        };

        if (status !== Status.None) {
            return (
                <span
                    style={{
                        marginTop: 10,
                        fontWeight: 'bold',
                        color: getStatusColor(),
                    }}
                >
                    {getStatus()}
                </span>
            );
        }

        return null;
    };

    return (
        <>
            <CenterContent>
                <h1 style={{ marginBottom: 10 }}>
                    Verificar score do reCAPTCHA 3
                </h1>
                <span
                    style={{
                        maxWidth: 600,
                        textAlign: 'center',
                        color: 'rgba(0, 0, 0, 0.6)',
                    }}
                >
                    Ao clicar no botão abaixo, vamos tentar adicionar um produto
                    no seu carrinho e removê-lo logo em seguida. Fazendo isso,
                    conseguiremos medir se o seu score é bom o suficiente para
                    realizar a compra sem ser bloqueado.
                </span>
                {renderStatus()}
                <Button
                    title={testingCart ? 'Verificando...' : 'Verificar'}
                    disabled={testingCart}
                    style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: 20,
                    }}
                    onClick={testCart}
                />
            </CenterContent>
            <Logo
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    fill: 'rgba(0, 0, 0, 0.3)',
                    zIndex: -1,
                    width: '100%',
                    height: '100%',
                }}
            />
        </>
    );
};

export default Recaptcha;
