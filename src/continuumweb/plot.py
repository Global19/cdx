import bbmodel
import blaze.server.rpc.protocol as protocol

class PlotClient(bbmodel.ContinuumModels):
    def __init__(self, docid, url):
        self.ph = protocol.ProtocolHelper()
        client = bbmodel.ContinuumModelsClient(docid, url, self.ph)
        storage = bbmodel.ContinuumModelsStorage()
        super(PlotClient, self).__init__(storage, client)
        self.fetch()
        interactive_context = self.get_bulk(typename='InteractiveContext')
        self.ic = interactive_context[0]
        
    def make_source(self, **kwargs):
        output = []
        flds = kwargs.keys()
        for idx in range(len(kwargs.values()[0])):
            point = {}
            for f in flds:
                point[f] = kwargs[f][idx]
            output.append(point)
        model = self.create('ObjectArrayDataSource', {'data' : output})
        return model

    def scatter(self, width, height, data_source, xfield, yfield, container=None):
        if container:
            plot = bbmodel.ContinuumModel('Plot', width=width, height=height,
                                          parent=container.ref())
        else:
            plot = bbmodel.ContinuumModel('Plot', width=width, height=height, parent=self.ic.ref())
        xr = bbmodel.ContinuumModel('PlotRange1d', plot=plot.ref(), attribute='width')
        yr = bbmodel.ContinuumModel('PlotRange1d', plot=plot.ref(), attribute='height')
        datarange1 = bbmodel.ContinuumModel(
            'DataRange1d', data_source=data_source.ref(),
            columns=[xfield])
        datarange2 = bbmodel.ContinuumModel(
            'DataRange1d', data_source=data_source.ref(), columns=[yfield])
        xmapper = bbmodel.ContinuumModel(
            'LinearMapper', data_range=datarange1.ref(),
            screen_range=xr.ref())
        ymapper = bbmodel.ContinuumModel(
            'LinearMapper', data_range=datarange2.ref(),
            screen_range=yr.ref())
        scatter = bbmodel.ContinuumModel(
            'ScatterRenderer', data_source=data_source.ref(),
            xfield=xfield, yfield=yfield, xmapper=xmapper.ref(),
            ymapper=ymapper.ref(), parent=plot.ref())
        xaxis = bbmodel.ContinuumModel(
            'D3LinearAxis', orientation='bottom', ticks=3,
            mapper=xmapper.ref(), parent=plot.ref())
        yaxis = bbmodel.ContinuumModel(
            'D3LinearAxis', orientation='left', ticks=3,
            mapper=ymapper.ref(), parent=plot.ref())
        plot.set('renderers', [scatter.ref()])
        plot.set('axes', [xaxis.ref(), yaxis.ref()])
        self.create_all([plot, xr, yr, datarange1, datarange2,
                         xaxis, yaxis, xmapper, ymapper, scatter])
        if container is None:
            self.show(plot)
        return plot
    
    def show(self, plot):
        children = self.ic.get('children')
        if children is None: children = []
        children.append(plot.ref())
        self.ic.set('children', children)
        self.update(self.ic.typename, self.ic.attributes)
        
