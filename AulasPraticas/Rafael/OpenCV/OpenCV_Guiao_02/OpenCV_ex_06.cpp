/*
 * OpenCV_ex_06.cpp
 *
 * Desenho de primitivas 2D e interaccao com o utilizador
 *
 * A FAZER : criar funcoes auxiliares
 *
 * J. Madeira - Dez/2012
 */


#include <iostream>


#include "opencv2/core/core.hpp"

#include "opencv2/highgui/highgui.hpp"


using namespace cv;

using namespace std;


// Variaveis GLOBAIS

Mat IMAGEM_GRAY;

Mat IMAGEM_RGB;

int ESCOLHA;


void myMouse_GRAY( int event, int x, int y, int flags, void *userdata )
{
     if( event == CV_EVENT_LBUTTONDOWN )
     {
         switch( (char)ESCOLHA )
         {
             case '1' :

                // Questao : que outros argumentos ha ?

                line( IMAGEM_GRAY, Point( x - 20, y - 20 ), Point( x + 20, y + 20 ), Scalar( 255 ) );

                // Questao : qual a orientacao so sistema de coordenadas da imagem ?

                imshow( "Imagem GRAY", IMAGEM_GRAY );

                break;

             case '2' :

                // Filled circle of radius 25

                circle( IMAGEM_GRAY, Point( x, y ), 25, Scalar( 255 ), -1);

                imshow( "Imagem GRAY", IMAGEM_GRAY );

                break;

             case '3' :

                // Questao : que outros argumentos ha ?

                rectangle( IMAGEM_GRAY, Point( x - 10, y - 10 ), Point( x + 10, y + 10 ), Scalar( 255 ), CV_FILLED );

                imshow( "Imagem GRAY", IMAGEM_GRAY );

                break;
         }
     }
}


void myMouse_RGB( int event, int x, int y, int flags, void *userdata )
{
     if( event == CV_EVENT_LBUTTONDOWN )
     {
         switch( (char)ESCOLHA )
         {
             case '1' :

                // Questao : que outros argumentos ha ?

                line( IMAGEM_RGB, Point( x - 20, y + 20 ), Point( x + 20, y - 20 ), Scalar( 0, 0, 255 ) );

                // Questao : qual a orientacao so sistema de coordenadas da imagem ?

                imshow( "Imagem RGB", IMAGEM_RGB );

                break;

             case '2' :

                // Filled circle of radius 25

                circle( IMAGEM_RGB, Point( x, y ), 25, Scalar( 255, 0, 0 ), -1);    // B,G,R !!

                imshow( "Imagem RGB", IMAGEM_RGB );

                break;

             case '3' :

                // Questao : que outros argumentos ha ?

                rectangle( IMAGEM_RGB, Point( x - 10, y - 10 ), Point( x + 10, y + 10 ), Scalar( 0, 255, 0 ), CV_FILLED );

                imshow( "Imagem RGB", IMAGEM_RGB );

                break;
         }
     }
}


int main( void )
{
    // Criar duas imagens com fundo negro

	IMAGEM_GRAY = Mat::zeros( 512, 256, CV_8UC1 );

	IMAGEM_RGB = Mat::zeros( 256, 512, CV_8UC3 );

	// Janelas

    namedWindow( "Imagem GRAY", CV_WINDOW_AUTOSIZE );

	namedWindow( "Imagem RGB", CV_WINDOW_AUTOSIZE );

    // Visualizar e imprimir caracteristicas

    imshow( "Imagem GRAY", IMAGEM_GRAY );

    cout << "Imagem com NIVEIS DE CINZENTO" << endl;

    cout << "Numero de linhas : " << IMAGEM_GRAY.size().height << endl;

    cout << "Numero de colunas : " << IMAGEM_GRAY.size().width << endl;

    cout << "Numero de canais : " << IMAGEM_GRAY.channels() << endl;

    cout << "Numero de bytes por pixel : " << IMAGEM_GRAY.elemSize() << endl;

    cout << endl;

    // Visualizar e imprimir caracteristicas

    imshow( "Imagem RGB", IMAGEM_RGB );

    cout << "Imagem RGB" << endl;

    cout << "Numero de linhas : " << IMAGEM_RGB.size().height << endl;

    cout << "Numero de colunas : " << IMAGEM_RGB.size().width << endl;

    cout << "Numero de canais : " << IMAGEM_RGB.channels() << endl;

    cout << "Numero de bytes por pixel : " << IMAGEM_RGB.elemSize() << endl;

    cout << endl;

    setMouseCallback( "Imagem GRAY", myMouse_GRAY );

    setMouseCallback( "Imagem RGB", myMouse_RGB );

    // Processar eventos do teclado

    for( ; ; )
    {
        cout << endl;

        cout << "1 --- Segmento de Recta" << endl;

        cout << "2 --- Circulo" << endl;

        cout << "3 --- Quadrado" << endl;

        cout << "Q --- Terminar" << endl;

        cout << endl;

        ESCOLHA = waitKey( 0 );

        if( ((char)ESCOLHA == 'Q') || ((char)ESCOLHA == 'q') )
        {
            break;
        }

        switch( (char)ESCOLHA )
        {
            case '1' :

                cout << "SEGMENTO DE RECTA : "

                     << "Seleccione o ponto medio com o BOTAO ESQUERDO do rato"

                     << endl;

                break;

            case '2' :

                cout << "CIRCULO : Seleccione o centro com o BOTAO ESQUERDO do rato" << endl;

                break;

            case '3' :

                cout << "QUADRADO : Seleccione o centro com o BOTAO ESQUERDO do rato" << endl;

                break;
        }
    }

	// Destruir as janelas --- Desnecessario neste programa simples

	destroyAllWindows( );

	return 0;
}
