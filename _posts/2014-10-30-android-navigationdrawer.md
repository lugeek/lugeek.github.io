---
layout: post
title: Android中NavigationDrawer的分析
description: Android中自带的NavigationDrawer是一个非常流行的组件，此文是对它的简要分析，梳理了它的实现过程，帮助理解。
categories: 技术
tags: Android
---

![drawer]({{ site.url }}/images/2014-10-30/face.jpg)

#布局分析
##1. activity_main(DrawerLayout:drawer_layout)
```xml
<android.support.v4.widget.DrawerLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/drawer_layout"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">
    
    <FrameLayout
        android:id="@+id/container"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
    
    <fragment android:id="@+id/navigation_drawer"
        android:layout_width="@dimen/navigation_drawer_width"
        android:layout_height="match_parent"
        android:layout_gravity="start"
        android:name="com.lugeek.encryption.NavigationDrawerFragment"
        tools:layout="@layout/fragment_navigation_drawer" />

</android.support.v4.widget.DrawerLayout>
```

1. FrameLayout(container):drawer中每个item对应的fragment容器，初试为FrameLayout,之后会在代码中被fragment取代。
2. fragment(navigation_drawer):drawer抽屉
	+ 抽屉菜单必须使用android:layout_gravity属性设置水平的 gravity值  .如果要支持 right-to-left (RTL，从右向左阅读)语言 用  "start"  代替  "left"  (当在 RTL语言运行时候，菜单出现在右侧)。
	+ 抽屉菜单的宽度为  dp  单位而高度和父View一样。抽屉菜单的宽度应该不超过320dp，这样用户可以在菜单打开的时候看到部分内容界面。
	

##2. fragment_main(RelativeLayout)
```xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingLeft="@dimen/activity_horizontal_margin"
    android:paddingRight="@dimen/activity_horizontal_margin"
    android:paddingTop="@dimen/activity_vertical_margin"
    android:paddingBottom="@dimen/activity_vertical_margin"
    tools:context=".MainActivity$PlaceholderFragment">

    <TextView
        android:id="@+id/section_label"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />

</RelativeLayout>
```

1. fragment_main是container容器的fragment对应的View布局，在PlaceholderFragment的onCreateView中被inflate的View，通过onNavigationDrawerItemSelected来替代activity_main中的id为container的Framelayout。

##3. fragment_navigation_drawer(ListView)
```xml
<ListView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:choiceMode="singleChoice"
    android:divider="@android:color/transparent"
    android:dividerHeight="0dp"
    android:background="#cccc"
    tools:context=".NavigationDrawerFragment" />
```

* 这是drawer抽屉的View布局，在NavigationDrawerFragment中的onCreateView中被inflate为View对象。

#Fragment分析
##Fragment
Fragment生命周期  
onAttach -> onCreate -> onCreateView -> onActivityCreated -> onStart -> onResume -> onPause -> onStop -> onDestroyView -> onDestroy -> onDetach  

Fragment生命周期是Activity生命周期的扩展。
##1. PlaceholderFragment
```java
/**
 * A placeholder fragment containing a simple view.
 */
public static class PlaceholderFragment extends Fragment {

    /**
     * The fragment argument representing the section number for this
     * fragment.
     */
    private static final String ARG_SECTION_NUMBER = "section_number";

    /**
     * Returns a new instance of this fragment for the given section
     * number.
     */
    public static PlaceholderFragment newInstance(int sectionNumber) {
        PlaceholderFragment fragment = new PlaceholderFragment();
        Bundle args = new Bundle();
        args.putInt(ARG_SECTION_NUMBER, sectionNumber);
        fragment.setArguments(args);
        return fragment;
    }

    public PlaceholderFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_main, container, false);
        return rootView;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        ((MainActivity) activity).onSectionAttached(
                getArguments().getInt(ARG_SECTION_NUMBER));
    }
}
```
1. newInstance产生一个fragment的实例，并传递一个键值为ARG_SECTION_NUMBER的参数
2. onCreateView使用R.layout.fragment_main作为fragment的view布局
3. onAttach中通过onSectionAttached取得ARG_SECTION_NUMBER对应的值并设置为title

##2. NavigationDrawerFragment
```java
/**
 * Fragment used for managing interactions for and presentation of a navigation drawer.
 * See the <a href="https://developer.android.com/design/patterns/navigation-drawer.html#Interaction">
 * design guidelines</a> for a complete explanation of the behaviors implemented here.
 */
public class NavigationDrawerFragment extends Fragment {

    /**
     * Remember the position of the selected item.
     */
    private static final String STATE_SELECTED_POSITION = "selected_navigation_drawer_position";

    /**
     * Per the design guidelines, you should show the drawer on launch until the user manually
     * expands it. This shared preference tracks this.
     */
    private static final String PREF_USER_LEARNED_DRAWER = "navigation_drawer_learned";

    /**
     * A pointer to the current callbacks instance (the Activity).
     */
    private NavigationDrawerCallbacks mCallbacks;

    /**
     * Helper component that ties the action bar to the navigation drawer.
     */
    private ActionBarDrawerToggle mDrawerToggle;

    private DrawerLayout mDrawerLayout;
    private ListView mDrawerListView;
    private View mFragmentContainerView;

    private int mCurrentSelectedPosition = 0;
    private boolean mFromSavedInstanceState;
    private boolean mUserLearnedDrawer;  //用户识别drawer标识位，第一次打开显示drawer，用户开启过drawer之后标识位置位

    /**
     * 空构造函数
     */
    public NavigationDrawerFragment() {
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Read in the flag indicating whether or not the user has demonstrated awareness of the
        // drawer. See PREF_USER_LEARNED_DRAWER for details.
        //获取sp的值，用于确认用户是否已经知道drawer了
        SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(getActivity());
        mUserLearnedDrawer = sp.getBoolean(PREF_USER_LEARNED_DRAWER, false);

        //恢复
        if (savedInstanceState != null) {
            mCurrentSelectedPosition = savedInstanceState.getInt(STATE_SELECTED_POSITION);
            mFromSavedInstanceState = true;
        }

        // Select either the default item (0) or the last selected item.
        selectItem(mCurrentSelectedPosition);
    }

    @Override
    public void onActivityCreated (Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        // Indicate that this fragment would like to influence the set of actions in the action bar.
        //拉开drawer后继续显示Menu
        setHasOptionsMenu(true);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        //获取drawer的listview。
        mDrawerListView = (ListView) inflater.inflate(
                R.layout.fragment_navigation_drawer, container, false);//false means attach to null.
        //listview的监听函数
        mDrawerListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                selectItem(position);
            }
        });
        //listview的适配器
        mDrawerListView.setAdapter(new ArrayAdapter<String>(
                getActionBar().getThemedContext(),
                android.R.layout.simple_list_item_activated_1,
                android.R.id.text1,
                new String[]{
                        getString(R.string.title_section1),
                        getString(R.string.title_section2),
                        getString(R.string.title_section3),
                }));
        mDrawerListView.setItemChecked(mCurrentSelectedPosition, true);
        return mDrawerListView;
    }

    public boolean isDrawerOpen() {
        //上面的isDrawerOpen和下面的isDrawerOpen不是同一个，下面这个是自带的。
        return (mDrawerLayout != null) && mDrawerLayout.isDrawerOpen(mFragmentContainerView);
    }

    /**
     * Users of this fragment must call this method to set up the navigation drawer interactions.
     *
     * @param fragmentId   The android:id of this fragment in its activity's layout.
     * @param drawerLayout The DrawerLayout containing this fragment's UI.
     */
    public void setUp(int fragmentId, DrawerLayout drawerLayout) {
        mFragmentContainerView = getActivity().findViewById(fragmentId);
        mDrawerLayout = drawerLayout;

        // set a custom shadow that overlays the main content when the drawer opens
        mDrawerLayout.setDrawerShadow(R.drawable.drawer_shadow, GravityCompat.START);
        // set up the drawer's list view with items and click listener

        ActionBar actionBar = getActionBar();
        //显示homebutton
        actionBar.setDisplayHomeAsUpEnabled(true);
        //按homebutton可以打开navigationdrawer
        actionBar.setHomeButtonEnabled(true);

        // ActionBarDrawerToggle ties together the the proper interactions
        // between the navigation drawer and the action bar app icon.
        mDrawerToggle = new ActionBarDrawerToggle(
                getActivity(),                    /* host Activity */
                mDrawerLayout,                    /* DrawerLayout object */
                R.drawable.ic_drawer,             /* nav drawer image to replace 'Up' caret */
                R.string.navigation_drawer_open,  /* "open drawer" description for accessibility */
                R.string.navigation_drawer_close  /* "close drawer" description for accessibility */
        ) {
            @Override
            public void onDrawerClosed(View drawerView) {
                super.onDrawerClosed(drawerView);
                if (!isAdded()) {
                    //if the NavigationDrawerFragment is not currently added to its activity
                    return;
                }

                getActivity().invalidateOptionsMenu(); // calls onPrepareOptionsMenu()
            }

            @Override
            public void onDrawerOpened(View drawerView) {
                super.onDrawerOpened(drawerView);
                if (!isAdded()) {
                    //if the NavigationDrawerFragment is not currently added to its activity
                    return;
                }

                if (!mUserLearnedDrawer) {
                    // The user manually opened the drawer; store this flag to prevent auto-showing
                    // the navigation drawer automatically in the future.
                    mUserLearnedDrawer = true;
                    SharedPreferences sp = PreferenceManager
                            .getDefaultSharedPreferences(getActivity());
                    sp.edit().putBoolean(PREF_USER_LEARNED_DRAWER, true).apply();
                }

                getActivity().invalidateOptionsMenu(); // calls onPrepareOptionsMenu()
            }
        };

        // If the user hasn't 'learned' about the drawer, open it to introduce them to the drawer,
        // per the navigation drawer design guidelines.
        if (!mUserLearnedDrawer && !mFromSavedInstanceState) {
            mDrawerLayout.openDrawer(mFragmentContainerView);
        }

        // Defer code dependent on restoration of previous instance state.
        mDrawerLayout.post(new Runnable() {
            @Override
            public void run() {
                mDrawerToggle.syncState();
            }
        });

        mDrawerLayout.setDrawerListener(mDrawerToggle);
    }

    private void selectItem(int position) {
        mCurrentSelectedPosition = position;
        if (mDrawerListView != null) {
            mDrawerListView.setItemChecked(position, true);
        }
        if (mDrawerLayout != null) {
            mDrawerLayout.closeDrawer(mFragmentContainerView);
        }
        if (mCallbacks != null) {
            mCallbacks.onNavigationDrawerItemSelected(position);
        }
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        try {
            mCallbacks = (NavigationDrawerCallbacks) activity;
        } catch (ClassCastException e) {
            throw new ClassCastException("Activity must implement NavigationDrawerCallbacks.");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mCallbacks = null;
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putInt(STATE_SELECTED_POSITION, mCurrentSelectedPosition);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        // Forward the new configuration the drawer toggle component.
        mDrawerToggle.onConfigurationChanged(newConfig);
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        // If the drawer is open, show the global app actions in the action bar. See also
        // showGlobalContextActionBar, which controls the top-left area of the action bar.
        if (mDrawerLayout != null && isDrawerOpen()) {
            inflater.inflate(R.menu.global, menu);
            showGlobalContextActionBar();
        }
        super.onCreateOptionsMenu(menu, inflater);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (mDrawerToggle.onOptionsItemSelected(item)) {
            return true;
        }

        if (item.getItemId() == R.id.action_example) {
            Toast.makeText(getActivity(), "Example action.", Toast.LENGTH_SHORT).show();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    /**
     * Per the navigation drawer design guidelines, updates the action bar to show the global app
     * 'context', rather than just what's in the current screen.
     */
    private void showGlobalContextActionBar() {
        ActionBar actionBar = getActionBar();
        actionBar.setDisplayShowTitleEnabled(true);
        actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);
        actionBar.setTitle(R.string.app_name);
    }

    private ActionBar getActionBar() {
        return getActivity().getActionBar();
    }

    /**
     * Callbacks interface that all activities using this fragment must implement.
     */
    public static interface NavigationDrawerCallbacks {
        /**
         * Called when an item in the navigation drawer is selected.
         */
        void onNavigationDrawerItemSelected(int position);
    }
}
```

1. onAttach:activity中实现了在当前fragment中定义的NavigationDrawerCallbacks接口，所以根据activity就获得了这个接口mCallbacks
2. onCreate:fragment创建时调用，完成以下三件事
	a. 从SharedPreferences中获取PREF_USER_LEARNED_DRAWER对应的值，如果不存在则默认false，这个值在用户第一次拉开drawer抽屉的时候赋值为true，赋值为true之后也就说明用户意识到了抽屉的存在，在打开软件的时候就不需要显示抽屉了。
	b. 从savedInstanceState恢复的时候，获取抽屉中当前选中的位置，并且设置标识位表示是恢复过来的，最后调用selectItem，将对应位置变为checked，再关闭抽屉，再通过接口回调调用activity中的onNavigationDrawerItemSelected。
3. onCreateView:根据R.layout.fragment_navigation_drawer产生一个listview布局，并设置监听函数
4. onActivityCreated:设置拉开drawer后继续显示Menu
5. setup:把actionBar和drawer联系起来，通过ActionBarDrawerToggle这个监听器监听打开和关闭drawer，打开和关闭drawer时actionbar发生相应的变化
6. Menu:在抽屉打开的时候显示R.menu.global为布局的menu
7. NavigationDrawerCallbacks:接口，在activity中定义drawer中的item被点击时执行的事件

#Drawer点击事件的响应过程
1. 监听函数的设置

		```java
		mDrawerListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                selectItem(position);
            }
        });
        ```
    
    监听函数里面又调用了`selectItem(position)`
2. selectItem(int position)
		```java
		private void selectItem(int position) {
	        mCurrentSelectedPosition = position;
	        if (mDrawerListView != null) {
	            mDrawerListView.setItemChecked(position, true);
	        }
	        if (mDrawerLayout != null) {
	            mDrawerLayout.closeDrawer(mFragmentContainerView);
	        }
	        if (mCallbacks != null) {
	            mCallbacks.onNavigationDrawerItemSelected(position);
	        }
    	}
    	```
    + 将当前位置mCurrentSelectedPosition置为当前点击的位置
    + 将被点击的位置突出标记
    + 将drawer关闭
    + 调用接口回调函数onNavigationDrawerItemSelected执行具体的点击事件
3. onNavigationDrawerItemSelected接口
		
		public static interface NavigationDrawerCallbacks {
	        /**
	         * Called when an item in the navigation drawer is selected.
	         */
	        void onNavigationDrawerItemSelected(int position);
    	}

4. onNavigationDrawerItemSelected接口实现
		
		/**
	     * 实现接口申明的方法。
	     * @param position :the position of item in drawer
	     */
	    @Override
	    public void onNavigationDrawerItemSelected(int position) {
	        // update the main content by replacing fragments
	        FragmentManager fragmentManager = getFragmentManager();
	        fragmentManager.beginTransaction()
	                .replace(R.id.container, PlaceholderFragment.newInstance(position + 1))
	                .commit();
	    }
	    
	* 将activity_main布局中R.id.container部分用新的fragment实体替换掉

#例子
![encryption]({{ site.url }}/images/2014-10-30/encryption.png)

我自己开发的信息加密的Android应用，采用了NavigationDrawer，见Github：[Encryption](https://github.com/lugeek/Encryption)

如果对你有帮助的话，记得给我star哦～