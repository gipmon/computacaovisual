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

    // binary threshold

    Mat thresholdFMediaBinary;

    threshold( imagemOriginal, thresholdFMediaBinary, 120, 255, THRESH_BINARY_INV );

    namedWindow( "Binary image", CV_WINDOW_AUTOSIZE );

    imshow( "Binrary image", thresholdFMediaBinary );

    // dilate

    Mat dilateImg_33;
    Mat dilateImg_1111;

    Mat element11_11 = getStructuringElement(MORPH_ELLIPSE, Size(11, 11));
    Mat element3_3 = getStructuringElement(MORPH_ELLIPSE, Size(3, 3));

    dilate(thresholdFMediaBinary, dilateImg_1111, element11_11);
    dilate(thresholdFMediaBinary, dilateImg_33, element3_3);

    Mat imageSubstract1111;
    Mat imageSubstract33;

    subtract(dilateImg_1111, thresholdFMediaBinary, imageSubstract1111);
    subtract(dilateImg_33, thresholdFMediaBinary, imageSubstract33);

    namedWindow( "thresholdFMediaBinary", CV_WINDOW_AUTOSIZE );
    imshow( "thresholdFMediaBinary", thresholdFMediaBinary );

    namedWindow( "imageSubstract1111", CV_WINDOW_AUTOSIZE );
    imshow( "imageSubstract1111", imageSubstract1111 );

    namedWindow( "imageSubstract33", CV_WINDOW_AUTOSIZE );
    imshow( "imageSubstract33", imageSubstract33 );
    // Esperar

    waitKey( 0 );

	// Destruir as janelas --- Desnecessario neste programa simples

	destroyAllWindows();

	return 0;
}
