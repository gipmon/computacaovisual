/*
 * OpenCV_ex_4_6.c
 *
 * FILTRO DE MEDIA
 *
 * J. Madeira - Dez/2012
 */


#include <iostream>


#include "opencv2/core/core.hpp"

#include "opencv2/imgproc/imgproc.hpp"

#include "opencv2/highgui/highgui.hpp"


using namespace cv;

using namespace std;


// FUNCOES AUXILIARES

void printImageFeatures( const Mat &imagem )
{
    cout << endl;

    cout << "Numero de linhas : " << imagem.size().height << endl;

    cout << "Numero de colunas : " << imagem.size().width << endl;

    cout << "Numero de canais : " << imagem.channels() << endl;

    cout << "Numero de bytes por pixel : " << imagem.elemSize() << endl;

    cout << endl;
}


// MAIN

int main( int argc, char** argv )
{
    if( argc != 2)
    {
        cout <<"Falta o nome do ficheiro da imagem !!" << endl;

        return -1;
    }

	Mat imagemOriginal;

	imagemOriginal = imread( argv[1], CV_LOAD_IMAGE_UNCHANGED );

	if( ! imagemOriginal.data )
	{
	    // Leitura SEM SUCESSO

	    cout << "Ficheiro nao foi aberto ou localizado !!" << endl;

	    return -1;
	}

	if( imagemOriginal.channels() > 1 )
	{
	    // Converter para 1 so canal !!

	    cvtColor( imagemOriginal, imagemOriginal, CV_BGR2GRAY, 1 );
	}

    // Janela

    namedWindow( "Imagem Original", CV_WINDOW_AUTOSIZE );

    // Visualizar

    imshow( "Imagem Original", imagemOriginal );

    // Imprimir alguma informacao

    cout << "IMAGEM ORIGINAL" << endl;

    printImageFeatures( imagemOriginal );

    // BINARY INV

    //Mat imagemBinary;

    //threshold( imagemOriginal, imagemBinary, 120, 255, THRESH_BINARY_INV);

    //namedWindow( "Binary Image", CV_WINDOW_AUTOSIZE );

    //imshow( "Binary Image", imagemBinary );

    //CRIAR ELEMENTO ESTRUTURANTE

    Mat se11_11;
    Mat se3_3;
    se11_11 = getStructuringElement(MORPH_RECT, Size(5,5));
    se3_3 = getStructuringElement(MORPH_RECT, Size(11,11));

    Mat imagemErode11;
    Mat imagemErode3;
    Mat imagemFinal11;
    Mat imagemFinal3;

    erode(imagemOriginal, imagemErode11, se11_11);
    dilate(imagemErode11, imagemFinal11, se11_11);
    erode(imagemOriginal, imagemErode3, se3_3);
    dilate(imagemErode3, imagemFinal3, se3_3);

    //Mat imagemSubtract11;
    //Mat imagemSubtract3;
    //subtract(imagemDilate11, imagemBinary, imagemSubtract11);
    //subtract(imagemDilate3, imagemBinary, imagemSubtract3);

    namedWindow( "Final5_5", CV_WINDOW_AUTOSIZE );

    imshow( "Final5_5", imagemFinal11 );

    namedWindow( "Final11_11", CV_WINDOW_AUTOSIZE );

    imshow( "Final11_11", imagemFinal3 );

    //namedWindow( "Subtract Image 3", CV_WINDOW_AUTOSIZE );

    //imshow( "Subtract Image 3", imagemSubtract3 );

    // Esperar

    waitKey( 0 );

	// Destruir as janelas --- Desnecessario neste programa simples

	destroyAllWindows();

	return 0;
}
