/*
 * OpenCV_ex_07.cpp
 *
 * Exemplo de abertura e visualiza��o de uma imagem com OpenCV
 *
 * J. Madeira - Nov/2012
 */


#include <iostream>

// Incluir as funcionalidades basicas do OpenCV

#include "opencv2/core/core.hpp"

#include "opencv2/highgui/highgui.hpp"


// Se quisermos simplificar a escrita de codigo podemos usar:

using namespace cv;

using namespace std;


int main( void )
{
    // Para armazenar uma imagem

	Mat image;

	// Ler uma imagem

	//CV_LOAD_IMAGE_UNCHANGED : imagem carregada tal como definida

	// Questao : que outras flags podemos usar ?

	image = imread( "lena.jpg", CV_LOAD_IMAGE_UNCHANGED );

	if( ! image.data )
	{
	    // Leitura SEM SUCESSO

	    cout << "Ficheiro nao foi aberto ou localizado !!" << endl;

	    return -1;
	}

	// Criar a janela para visualiza��o

    // CV_WINDOW_AUTOSIZE : o tamanho da janela depende do tamanho da imagem

    namedWindow( "Display window", CV_WINDOW_AUTOSIZE );
    namedWindow( "Display window2", CV_WINDOW_AUTOSIZE );

    Mat image2;
    image2 = image.clone();
    for(int x=0; x < image.size().width; x+=20){
        line( image2, Point( x, 0 ), Point( x , image.size().height ), Scalar( 255, 255, 255 ) );
    }

    for(int y=0; y < image.size().width; y+=20){
        line( image2, Point( 0, y ), Point( image.size().height, y ), Scalar( 255, 255, 255 ) );
    }

   // Mostrar a imagem

    imshow( "Display window", image );
    imshow( "Display window2", image2 );

    // Esperar

    waitKey( 0 );

	// Destruir a janela --- Desnecessario neste programa simples

	destroyWindow( "Display window" );

	return 0;
}
